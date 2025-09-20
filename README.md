<h1 align="center">📊 Inter-Endpoint Dependency Analysis in RESTful APIs</h1>

<p align="center">
This repository contains the <b>source code for static and dynamic analysis of inter-endpoint dependencies</b>, as introduced in the paper:
</p>

<p align="center">
<b>"Enhancing API Documentation by Inter-Endpoint Dependency Graphs"</b><br/>
<i>Authors: 
<a href="https://github.com/PanagiotisPapadeas">Panagiotis Papadeas</a>, 
<a href="https://github.com/DimitrisDavidGerokonstantis">Dimitris Gerokonstantis</a>, 
<a href="https://github.com/ChristosHadjichristofi">Christos Hadjichristofi</a>, 
<a href="https://github.com/vvescoukis">Vassilios Vescoukis</a></i><br/>
<a href="https://annals-csis.org/proceedings/2025/pliks/8035.pdf">Published</a> at the 20th Conference on Computer Science and Intelligence Systems <a href="https://2025.fedcsis.org/">(FedCSIS, 2025)</a>
</p>

---

## 🌐 Inter-Endpoint Dependencies

When working with APIs, developers need more than just documentation on **how to call each endpoint**—they also need to understand **how endpoints interact with each other**.  

Unfortunately, most API documentation treats each endpoint as an isolated entity and **fails to highlight these interconnections**. This project aims to close that gap by identifying and documenting a specific type of interaction: **inter-endpoint dependencies**.  

👉 An **inter-endpoint dependency** occurs when:  
- Invoking endpoint **Y** requires data produced by endpoint **X**.  
- This implies a dependency order `(X → Y)`, meaning **Y depends on X**.  

### 🔹 Types of Inter-Endpoint Dependencies
<div align="center">

| Type        | Description |
|-------------|-------------|
| **body-body** | Response body data is used in the **request body** of another API call. |
| **body-path** | Response body data is used as a **path parameter** in another API call. |
| **body-query** | Response body data is used as a **query parameter** in another API call. |

</div>

---

## 🎯 Objectives of This Work

We provide **two complementary approaches** for detecting inter-endpoint dependencies:

### 1️⃣ Static Analysis
- **Based on API documentation**.  
- Identifies matches between input/output attributes based on types, values, and parameter names.  
- **Input**: A **Postman Collection** describing request/response schemas and containing sample API calls with real data.  

### 2️⃣ Dynamic Analysis
- **Based on real API traffic**, captured using a **man-in-the-middle (MIM) agent**.  
- Matches input and output values across different API calls.  
- **Input**: A log file of API requests and responses recorded by the MIM agent.  
- **Implementation**: A standalone Dockerized MIM service (other options possible, e.g., browser extensions or API gateway plugins).  
- More details: [`DynamicAnalysis/man_in_the_middle/`](DynamicAnalysis/man_in_the_middle/).  

---

## 📝 Static Analysis: How It Works

The [`StaticAnalysis/`](StaticAnalysis/) folder contains the full implementation and resources for static analysis.  

<details>
<summary><b>▶️ Running the Static Dependency Analyzer</b></summary>

1. Navigate to [`StaticAnalysis/dependencies/`](StaticAnalysis/dependencies/).  
2. Prepare an input Postman Collection and save it in the `input_files/` directory (sample collections are provided in [`StaticAnalysis/dependencies/input_files/`](StaticAnalysis/dependencies/input_files/), e.g., the **PayPal API (Paypal.json)**).  
3. Run the analyzer:  
   ```
   python DependencyGraph.py
   ```

4. Provide the name of your input Postman Collection (you may use one of the provided examples or your own collection).

5. Configure options when prompted:

   * **Include query and path parameters** → Detect dependencies not only for request bodies but also for **query** and **path** parameters.
   * **GET dependencies only** → Restrict analysis to dependencies derived only from `GET` endpoints (the most common dependency case).

6. Results will be saved in:

   ```
   StaticAnalysis/dependencies/output_files/jsonObject.txt
   ```

</details>

---

## ⚡ Dynamic Analysis: How It Works

The [`DynamicAnalysis/`](DynamicAnalysis/) folder contains the full implementation and utilities for dynamic analysis.

<details>
<summary><b>▶️ Running the Dynamic Dependency Analyzer</b></summary>

1. Prepare a log file of API calls (examples provided in [`DynamicAnalysis/man_in_the_middle/exported_logs/`](DynamicAnalysis/man_in_the_middle/exported_logs) for **Notion**, **PayPal**, and **OpenAI** APIs). You can use our MIM agent implementation to generate you own log file ([`DynamicAnalysis/man_in_the_middle/standalone_mim_implementation/`](DynamicAnalysis/man_in_the_middle/standalone_mim_implementation/)).

2. Navigate to [`DynamicAnalysis/dynamic_dependency_analyser/`](DynamicAnalysis/dynamic_dependency_analyser/).

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run the analyzer:

   ```
   python dynamicDependencyAnalyser.py
   ```

5. Provide the path to your input log file (you may use one of the included examples).

6. Configure options when prompted:

   * **Include query parameters** → Detect dependencies involving query parameters.
   * **Include path parameters** → Detect dependencies involving path parameters (⚠️ treats all path segments as potential path parameters, which may generate false positives).
   * **GET dependencies only** → Restrict analysis to dependencies starting only from `GET` requests.
   * **Include boolean values** → Decide whether to consider boolean values in matching (may cause misleading dependencies).
   * **Strict typing** → Require matching values to also share the same data type (e.g., `"42"` vs `42`).

7. Results will be saved in [`DynamicAnalysis/dynamic_dependency_analyser/output_files/`](DynamicAnalysis/dynamic_dependency_analyser/output_files/)

---

## 🔧 Utilities

Located in [`DynamicAnalysis/utils-helpers/`](DynamicAnalysis/utils-helpers/):

* **Log Splitter**: Split a log file by use case to narrow analysis scope.
* **Postman Filter**: Keep only a subset of endpoints in a Postman Collection for more focused static analysis.

---

</details>

## 🗂️ Output

Both static and dynamic analysis methods generate a **structured JSON file** containing:

* Number of nodes and edges
* Types and counts of dependencies
* Additional metadata

These outputs can be visualized using the **RADAR tool**:
👉 [RADAR – REST API Dependencies and Analysis of Relationships](https://radar.softlab.ntua.gr)

<div>

### 📊 RADAR Visualization

* **Nodes** = Endpoints
* **Edges** = Dependencies

</div>
