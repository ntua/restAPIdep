# 🕵️‍♂️ Man-in-the-Middle (MIM) Agent

---

## 📖 Description
The **MIM agent** acts as a transparent proxy between an API client and a server. It captures and logs API calls while forwarding requests and responses.  

<div align="center">

### 🔄 Workflow
| Step | Action |
|------|--------|
| 1️⃣ | Client sends an API request to MIM |
| 2️⃣ | MIM forwards the request to the target API |
| 3️⃣ | MIM logs request and response details |
| 4️⃣ | MIM returns the response to the client |

<p align="center">
  <img src="https://github.com/user-attachments/assets/18d17c45-7489-40a2-9c35-529bf591a1c8" width="600" style="border-radius:10px;box-shadow:0px 4px 10px rgba(0,0,0,0.1);" />
</p>

</div>

### 🔍 Data Captured by MIM

| Field      | Description |
|------------|-------------|
| **ip**     | Client's IP address |
| **method** | HTTP method |
| **url**    | Target API URL |
| **endpoint** | Invoked endpoint |
| **headers**  | Request headers and values |
| **body**     | Request body |
| **query**    | Query parameters |
| **params**   | Path segments (including path parameters) |
| **response** | Response body |
| **tag**      | User-defined label (e.g., use case ID) |

<p align="center">
  <img src="https://github.com/user-attachments/assets/be0ee5ed-e2fd-4776-b18a-cc927242a227" width="400" style="border-radius:10px;box-shadow:0px 4px 10px rgba(0,0,0,0.1);" />
</p>

---

## 🚀 When and How to Use MIM

✔️ Place MIM **between the API client and server**  
✔️ For **public APIs**, MIM can run locally  
✔️ For **enterprise/private APIs**, deploy MIM **inside the private network**  
❌ If a firewall blocks direct access, MIM cannot capture traffic

---

## 🛠️ Local Setup
Make sure [Docker](https://docs.docker.com/engine/install/) is installed:

```
cd standalone_mim_implementation
(sudo) docker-compose up
```

👉 MIM will be available at: **[http://localhost:3003](http://localhost:3003)**

---

## 🔗 Making API Calls via MIM

**Original PayPal sandbox API call:**

```
PUT https://api-m.sandbox.paypal.com/v2/invoicing/invoices/INV2-J43G-QASS-VQZX-HRL2?send_to_recipient=true&send_to_invoicer=true
```

**Through MIM:**

```
PUT http://localhost:3003/proxy/https_api-m_sandbox_paypal_com/usecase42/v2/invoicing/invoices/INV2-J43G-QASS-VQZX-HRL2?send_to_recipient=true&send_to_invoicer=true
```

**Rules:**

* `:domain` → API domain with `://` and `.` replaced by `_`  
* `:tag` → user-defined label (e.g., `usecase42`)

---

## 📤 Exporting API Calls

Export logs for a specific API:

```
GET /proxy_utils/export/:domain
```

**Example (PayPal sandbox):**

```
GET http://localhost:3003/proxy_utils/export/https_api-m_sandbox_paypal_com
```

📁 Exported `.json` files are saved in:

```
/standalone_mim_implementation/downloads
```

---

## 🧪 API Test Scripts

Dynamic analysis was validated on:

* **Notion**  
* **OpenAI**  
* **PayPal**

For automating the API interaction process, some API scripts were written.
Scripts are available at: [`DynamicAnalysis/man_in_the_middle/test_scripts/`](DynamicAnalysis/man_in_the_middle/test_scripts/)

* **Notion & OpenAI** → API interaction only.  
* **PayPal** → Required UI automation (via **[Selenium](https://www.selenium.dev/documentation/)**) in addition to API calls.

⚠️ These scripts are tied to specific API/UI versions and may no longer work out-of-the-box. Use them as **patterns**.

---

## 💳 PayPal Scripts

Scripts demonstrating PayPal API use cases live in:  
[`DynamicAnalysis/man_in_the_middle/test_scripts/paypal scripts`](DynamicAnalysis/man_in_the_middle/test_scripts/paypal%20scripts)

### Setup

```
cd DynamicAnalysis/man_in_the_middle/test_scripts/paypal\ scripts
npm install
```

### Run

```
node index.js [arguments]
```

* `node index.js all` → Run all use cases  
* `node index.js 3 4` → Run use cases 3 and 4

<details>
<summary>📌 <b>Available PayPal Use Cases</b></summary>

| Use Case | Description                                                                              |
| -------- | ---------------------------------------------------------------------------------------- |
| **1**    | Create product & order → buyer pays → seller adds tracking                               |
| **1b**   | Create order → authorize → cancel                                                        |
| **1c**   | Create product & order → capture payment → refund                                        |
| **2**    | Two products → create invoice → buyer pays → cancel/delete                               |
| **2b**   | Invoice created → buyer pays → payment deleted → retry → refund                          |
| **3**    | Full dispute workflow → escalation → PayPal agent resolution → appeal                    |
| **3b**   | Dispute resolved with return process                                                     |
| **4**    | Create order → authorize & capture → dispute → return                                    |
| **5**    | Create monthly billing plan & subscription                                               |
| **6**    | Multiple payments → cancel unclaimed items                                               |
| **7**    | Webhook setup → create order → capture payment → simulate events → update/delete webhook |
| **8**    | Invoice template → create → update → delete                                              |

</details>

---

## ✍️ Writing Your Own Scripts

* Use **[Selenium](https://www.selenium.dev/documentation/)** for automating browser interactions when needed.  
* Use **JavaScript** with **Axios** for API calls.  
* Combine **MIM + Selenium** to log both API and UI interactions in complete workflows.
