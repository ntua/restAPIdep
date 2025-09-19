# Inter-Endpoint Dependency Analysis

This repository contains the **source code for both static and dynamic analysis of inter-endpoint dependencies**, as introduced and investigated in the paper:

**"Enhancing API Documentation by Inter-Endpoint Dependency Graphs"**  
*Authors: [Panagiotis Papadeas](https://github.com/PanagiotisPapadeas), [Dimitris Gerokonstantis](https://github.com/DimitrisDavidGerokonstantis), [Christos Hadjichristofi](https://github.com/ChristosHadjichristofi), [Vassilios Vescoukis](https://github.com/vvescoukis)*  
*Published at the 20th Conference on Computer Science and Intelligence Systems (FedCSIS, 2025)*

---

## 🌐 Inter-Endpoint Dependencies

When interacting or integrating with APIs, it is essential that developers have information **not only about how to call each endpoint**, but also about **all possible interactions with other endpoints** that either consume output or provide input data.  

Current API documentation usually treats each endpoint as an independent service and **does not highlight these interactions**.  

An **inter-endpoint dependency** is an interaction between API endpoints:  

- If invoking endpoint **Y** requires input data obtained from a call to endpoint **X**, then the required call order is `(X, Y)`, and thus we say that **Y depends on X**.  

### Types of Inter-Endpoint Dependencies

1. **body-body**: Information retrieved from the **response body** of an API call serves as input to the **request body** of the next API call.  
2. **body-path**: Information retrieved from the **response body** serves as a **path parameter** input for the next API call.  
3. **body-query**: Information retrieved from the **response body** serves as a **query parameter** input for the next API call.  

---

## 🎯 Objective of Our Work

We introduce **two approaches** for identifying inter-endpoint dependencies:

### 1️⃣ Static Analysis
- **Based on API documentation**: Identifies matches on values, types, or parameter names of input/output attributes of API calls.  
- **Input**: Postman Collection of the API under analysis.    

### 2️⃣ Dynamic Analysis
- **Based on actual API calls** captured using a **man-in-the-middle (MIM) agent**.  
- Analyzes HTTP traffic to find matches between **input and output values** of different API calls.  
- **Input**: Log file of real API calls exported by the MIM agent.  
- **Implementation**: Standalone dockerized MIM component (other implementations possible, e.g., browser extensions or internal API Gateway components).  
- **More information**: Refer to the `DynamicAnalysis/man_in_the_middle/` folder in this repository.  

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

