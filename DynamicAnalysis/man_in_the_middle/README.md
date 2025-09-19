# man-in-the-middle (MIM) Agent 🕵️‍♂️

## Description
The **MIM agent** captures and logs API requests while acting as an intermediary between the client and the API. It **forwards requests to the API, receives responses, stores relevant information, and returns the responses to the client**.  

Workflow:

1. Client sends an API request to MIM.  
2. MIM forwards the request to the target API.  
3. MIM logs request and response details.  
4. Response is returned to the client.  

<p align="center"><img src="https://github.com/user-attachments/assets/18d17c45-7489-40a2-9c35-529bf591a1c8" width="600" height="280" /></p>

### Data Captured by MIM
- **ip**: Client's IP address  
- **method**: HTTP method  
- **url**: Target API URL  
- **endpoint**: Invoked API endpoint  
- **headers**: Request headers and values  
- **body**: Request body  
- **query**: Query parameters (if any)  
- **params**: URL segments including path parameters  
- **response**: Response body  
- **tag**: User-defined label (e.g., the use case number associated with this call)  

<p align="center"><img src="https://github.com/user-attachments/assets/be0ee5ed-e2fd-4776-b18a-cc927242a227" width="400" height="230" /></p>

---

## When and How to Use MIM
- MIM must be placed **between an API client and an accessible API server**.  
- For **public APIs**, MIM can run locally.  
- For **private enterprise APIs**, deploy MIM **within the private network** to capture traffic.  
- If a firewall restricts access, MIM cannot forward or capture traffic.

---

## Local Setup
Ensure you have [Docker](https://docs.docker.com/engine/install/) installed, then:

```bash
cd mim
(sudo) docker-compose up
````

* MIM will run locally on **port 3003**.

---

## Making API Calls via MIM

Original PayPal sandbox API call:

```
PUT https://api-m.sandbox.paypal.com/v2/invoicing/invoices/INV2-J43G-QASS-VQZX-HRL2?send_to_recipient=true&send_to_invoicer=true
```

Use the MIM proxy endpoint format:

```
/proxy/:domain/:tag/*
```

* **:domain** → target API domain (`://` and `.` replaced with `_`)
* **:tag** → user-defined label

Example using tag `usecase42`:

```
PUT http://localhost:3003/proxy/https_api-m_sandbox_paypal_com/usecase42/v2/invoicing/invoices/INV2-J43G-QASS-VQZX-HRL2?send_to_recipient=true&send_to_invoicer=true
```

> Include the request body, headers, and authorization tokens as required.

---

## Exporting API Calls

To export API logs, use the endpoint:

```
GET /proxy_utils/export/:domain
```

Example for PayPal sandbox:

```
GET http://localhost:3003/proxy_utils/export/https_api-m_sandbox_paypal_com
```

* Exported `.json` files are saved in `/mim/downloads`.

---

## PayPal Scripts

The `/paypal_scripts` directory contains scripts demonstrating PayPal API use cases.

### Setup

```bash
cd paypal_scripts
npm install
```

### Running Scripts

```bash
node index.js [arguments]
```

* **arguments**: Space-separated use case IDs

  * `node index.js all` → run all use cases
  * `node index.js 3 4` → run use cases 3 and 4

**Available Use Cases:**

* **1**: Create a product and order; buyer pays; seller adds tracking.
* **1b**: Create order; authorize payment; cancel payment.
* **1c**: Create product and order; capture payment; refund.
* **2**: Create two products; create invoice; buyer pays; cancel/delete invoice.
* **2b**: Invoice created; buyer pays; payment deleted; retry; refund.
* **3**: Order created; buyer pays; dispute workflow with escalation to PayPal agent; full refund if resolved in favor of buyer; appeal process for seller.
* **3b**: Order created; buyer pays; dispute resolved; item returned.
* **4**: Create order; authorize and capture payment; dispute; item returned.
* **5**: Create monthly billing plan and subscription.
* **6**: Make multiple payments; cancel unclaimed items.
* **7**: Configure webhook; create order; capture payment; simulate webhook events; update and delete webhook.
* **8**: Create, update, and delete invoice template.

---

## Writing Your Own Scripts

* Use **[Selenium](https://www.selenium.dev/documentation/)** for browser automation if UI interaction is required.
* Use **JavaScript** with **Axios** for API calls.
* Combine MIM and Selenium to fully capture and log API interactions during automated workflows.
