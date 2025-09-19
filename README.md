# Inter-Endpoint Dependency Analysis in RESTful APIs 📊

This repository contains the **source code for static and dynamic analysis of inter-endpoint dependencies**, as presented in the paper:

**"Enhancing API Documentation by Inter-Endpoint Dependency Graphs"**  
*Authors: [Panagiotis Papadeas](https://github.com/PanagiotisPapadeas), [Dimitris Gerokonstantis](https://github.com/DimitrisDavidGerokonstantis), [Christos Hadjichristofi](https://github.com/ChristosHadjichristofi), [Vassilios Vescoukis](https://github.com/vvescoukis)*  
*[Published](https://annals-csis.org/proceedings/2025/pliks/8035.pdf) at the 20th Conference on Computer Science and Intelligence Systems (FedCSIS, 2025)*

---

## 🌐 Inter-Endpoint Dependencies

When interacting or integrating with APIs, it is essential that developers have information **not only about how to call each endpoint**, but also about **all possible interactions with other endpoints** that either consume output or provide input data.  

Current API documentation usually treats each endpoint as an independent service and **does not highlight how endpoints interact with each other**. This project focuses on **identifying and documenting a specific type of these interactions, called inter-endpoint dependencies**.

An **inter-endpoint dependency** is an interaction between API endpoints:  

- If invoking endpoint **Y** requires input data obtained from a call to endpoint **X**, then the required call order is `(X, Y)`, and thus we say that **Y depends on X**.  

### 🔹 Types of Inter-Endpoint Dependencies

1. **body-body**: Response data from one API call is used as the **request body** of another.  
2. **body-path**: Response data from one API call is used as a **path parameter** for another.  
3. **body-query**: Response data from one API call is used as a **query parameter** for another.  

---

## 🎯 Objective of Our Work

We introduce **two approaches** for identifying inter-endpoint dependencies:

### 1️⃣ Static Analysis
- **Based on API documentation**: Identifies matches on types, values, or parameter names of input/output attributes of API endpoints.  
- **Input**: A **Postman Collection** including request/response structures and full examples of API calls with real data.    

### 2️⃣ Dynamic Analysis
- **Based on actual API calls** captured using a **man-in-the-middle (MIM) agent**.  
- Analyzes HTTP traffic to find matches between **input and output values** of different API calls.  
- **Input**: Log file of real API calls exported by the MIM agent.  
- **Implementation**: Standalone dockerized MIM component (other implementations possible, e.g., browser extension or internal API Gateway component).  
- **More information**: Refer to the [`DynamicAnalysis/man_in_the_middle/`](DynamicAnalysis/man_in_the_middle/) folder in this repository.  

---

## 🗂️ Output

- Both methods produce a **structured JSON file** containing the identified dependencies along with metadata:  
  - Number of nodes and edges  
  - Number of different dependency types  
  - Additional analysis metadata  

- For visualization and demonstration, both methods are incorporated in the publicly available tool **RADAR**:  
  [RADAR – REST API Dependencies and Analysis of Relationships](https://radar.softlab.ntua.gr)  
  - Upload a Postman collection for **static analysis**.  
  - Upload a log file from the MIM agent for **dynamic analysis**.  
  - RADAR visualizes the output JSON as a **directed graph**, where nodes are endpoints and edges indicate dependencies. 

