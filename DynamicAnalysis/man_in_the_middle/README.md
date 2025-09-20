# 🕵️‍♂️ Man-in-the-Middle (MIM) Agent

---

## 📖 Description

The **MIM agent** acts as a transparent proxy between an API client and a server. It captures and logs API calls while forwarding requests and responses.  

<div align="center">

### 🔄 Workflow
| Step | Action |
|------|--------|
| 1️⃣ | Client sends an API request to **MIM** |
| 2️⃣ | **MIM** forwards the request to the target API |
| 3️⃣ | **MIM** logs request & response details |
| 4️⃣ | **MIM** returns the response to the client |

<img src="https://github.com/user-attachments/assets/18d17c45-7489-40a2-9c35-529bf591a1c8" width="600" height="280" />

</div>

---

### 🔍 Data Captured by MIM

| Field      | Description |
|------------|-------------|
| **ip**     | Client's IP address |
| **method** | HTTP method |
| **url**    | Target API URL |
| **endpoint** | Invoked endpoint |
| **headers**  | Request headers & values |
| **body**     | Request body |
| **query**    | Query parameters |
| **params**   | Path segments (including path parameters) |
| **response** | Response body |
| **tag**      | User-defined label (e.g., use case ID) |

<div align="center">
<img src="https://github.com/user-attachments/assets/be0ee5ed-e2fd-4776-b18a-cc927242a227" width="400" height="230" />
</div>

---

## 🚀 When and How to Use MIM

✔️ Place **MIM between the API client and server**  
✔️ For **public APIs**, run locally  
✔️ For **private APIs**, deploy inside the **private network**  
❌ If a firewall blocks access → **MIM cannot capture traffic**

---

## 🛠️ Local Setup

Make sure [Docker](https://docs.docker.com/engine/install/) is installed, then run:

```
cd standalone_mim_implementation
(sudo) docker-compose up
````

👉 MIM will be available at: **[http://localhost:3003](http://localhost:3003)**

---

## 🔗 Making API Calls via MIM

**Original PayPal sandbox API call:**

```
PUT https://api-m.sandbox.paypal.com/v2/invoicing/invoices/INV2-J43G-QASS-VQZX-HRL2?send_to_recipient=true&send_to_invoicer=true
```

**Through MIM (with tag `usecase42`):**

```
PUT http://localhost:3003/proxy/https_api-m_sandbox_paypal_com/usecase42/v2/invoicing/invoices/INV2-J43G-QASS-VQZX-HRL2?send_to_recipient=true&send_to_invoicer=true
```

🔑 **Rules:**

* `:domain` → replace `://` and `.` with `_`
* `:tag` → user-defined label

---

## 📤 Exporting API Calls

```
GET /proxy_utils/export/:domain
```

**Example:**

```
GET http://localhost:3003/proxy_utils/export/https_api-m_sandbox_paypal_com
```

📁 Logs are exported as `.json` into:

```
/standalone_mim_implementation/downloads
```

---

## 🧪 API Test Scripts

Dynamic analysis validated on:

* **Notion**
* **OpenAI**
* **PayPal**

📂 Scripts: [`DynamicAnalysis/man_in_the_middle/test_scripts/`](DynamicAnalysis/man_in_the_middle/test_scripts/)

⚠️ These scripts may break due to API version changes. Treat them as **patterns**.

---

## 💳 PayPal Scripts

📂 Location: [`DynamicAnalysis/man_in_the_middle/test_scripts/paypal scripts`](DynamicAnalysis/man_in_the_middle/test_scripts/paypal%20scripts)

### ⚙️ Setup

```
cd DynamicAnalysis/man_in_the_middle/test_scripts/paypal\ scripts
npm install
```

### ▶️ Run

```
node index.js [arguments]
```

* `node index.js all` → Run all use cases
* `node index.js 3 4` → Run use cases **3** and **4**

---

<details>
<summary>📌 <b>Available PayPal Use Cases</b></summary>

1. Create product & order → buyer pays → seller adds tracking
   1b. Create order → authorize → cancel
   1c. Create product & order → capture payment → refund

2. Two products → create invoice → buyer pays → cancel/delete
   2b. Invoice created → buyer pays → payment deleted → retry → refund

3. Full dispute workflow → escalation → PayPal agent resolution → appeal
   3b. Dispute resolved with return process

4. Create order → authorize & capture → dispute → return

5. Create monthly billing plan & subscription

6. Multiple payments → cancel unclaimed items

7. Webhook setup → create order → capture payment → simulate events → update/delete webhook

8. Invoice template → create → update → delete

</details>

---

## ✍️ Writing Your Own Scripts

* Use **[Selenium](https://www.selenium.dev/documentation/)** for UI automation
* Use **JavaScript** + **Axios** for API calls
* Combine **MIM + Selenium** for full workflow logging

