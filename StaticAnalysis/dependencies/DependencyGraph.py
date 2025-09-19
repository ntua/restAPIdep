#open yaml file
#dependency2.json
import ast
import json
while True:
    f = input("Enter postman collection (.json) file: ")
    #print(f)
    try:        
        with open('input_files/'+f, errors='ignore') as file:
            # read a list of lines into data
            data = file.readlines()
            break
    except IOError:
        print("File not found")

get_method = True
while True:
    f1 = input('Check only dependencies from endpoints with method "GET"? (yes / no): ')
    if f1 == "yes" or f1 == "y" or f1 == "":
        filename = 'GET'
        get_method = True
        break
    elif f1 == "no" or f1 == "n":
        filename = 'ALL'
        get_method = False
        break

while True:
    f2 = input('Include query and path parameters? (yes / no): ')
    if f2 == "yes" or f2 == "y" or f2 == "":
        pathQuery = True
        break
    elif f2 == "no" or f2 == "n":
        pathQuery = False
        break

name=-1
flag = 'null'
desc = False
res_set = {}
res_id = {}
all_ids = set()
all_ids_info = {}
all_ids_description = {}
excluded_keys = {}
responsebody = False
for line in data:
    if desc == True and ']' in (line):
        all_ids_description[id] = ""
    if '"name":' in (line):
        #id+=1
        name =line.split(':')[1].replace('"', '').replace(',','').strip()
        #print(id)
    elif '"request":' in (line):
        flag = 'req'
        id = name
        all_ids.add(id)   
    elif '"response":' in (line):
        flag = 'res'
        desc = False
    elif '"description":' in (line) and flag == 'req':
        desc = True
        description = line.split(': ')[1].replace('"', '').strip()
        all_ids_description[id] = description
    elif '"method":' in (line):
        method = line.split(':')[1].replace('"', '').replace(',','').strip()
        all_ids_info[id] = method
    elif '"body":' in (line):
        if flag == 'res' and (get_method == False or (get_method == True and method == 'GET')):
            responsebody = True
            #print(line)
            x = line.replace('[','').replace(']','').replace('{','').replace('}','').replace('  ','').replace("\\n",'').replace('"body":','').replace(',','').strip()
            #print(x)
            length = len(x.split(': '))
            u = 0
            for i in x.split(': '):
                #print(i)
                u=u+1
                j = i.split('\\"')
                #print(j)
                if len(j) == 3:
                    if u != length:
                        key = j[1]
                    else:
                        #print(u)
                        value = j[1]
                        if key not in res_set:
                            res_set[key] = set()
                            res_id[key] = {(id, value)}
                        else:
                            if (id,value) not in res_id[key]:
                                res_id[key].add((id, value))
                        if value not in res_set[key]:
                            res_set[key].add(value)        
                elif len(j) == 2:
                    pass
                elif len(j) == 5:
                    value = j[1]
                    if key not in res_set:
                        res_set[key] = set()
                        res_id[key] = {(id, value)}
                    else:
                        if (id, value) not in res_id[key]:
                            res_id[key].add((id, value)) 
                    if value not in res_set[key]:
                        res_set[key].add(value)
                    #print(key, value)
                    key = j[3]              

for l in res_set:
    if "''" in res_set[l]:
        res_set[l].remove('')
#     print (l, res_set[l])
# for l in res_id:
#     print (l, res_id[l])

with open('input_files/'+f, errors='ignore') as file1:
    # read a list of lines into data
    data1 = file1.readlines()

name=-1
flag = 'null'
body = False
req_set = {}
req_id = {}
req_key = {}
res_key = {}
res_dep = {}
req_dep = {}
endpoints_dep = set()
attributes_dep = set()
depid=0
query = False
path = False
#print(data)
for line in data1:
    if '"name":' in (line):
        name =line.split(':')[1].replace('"', '').replace(',','').strip()
        #print(id)
    elif '"request":' in (line):
        flag = 'req'
        id = name
        body = False   
    elif '"response":' in (line):
        flag = 'res'
    elif '"body":' in (line):
        body = True
    elif '"query":' in (line) and ']' not in (line):
        query = True
    elif '"variable":' in (line) and ']' not in (line):
        path = True
    elif query == True and ']' in (line):
        query = False
    elif path == True and ']' in (line):
        path = False
    elif query == True and '"key":' in (line):
        querykey = line.split(':')[1].replace('"', '').replace(',','').strip()
    elif query == True and '"value":' in (line):
        queryvalue = line.split(':')[1].replace('"', '').replace(',','').strip()
        #print(querykey, queryvalue, 'query')
        if queryvalue != '' and pathQuery == True:
            for keychain in res_set:
                            if queryvalue in res_set[keychain]:
                                for tempid in res_id[keychain]:
                                    if id != tempid[0] and queryvalue == tempid[1] and keychain not in excluded_keys:
                                        if (tempid[0], id) not in endpoints_dep:
                                            endpoints_dep.add((tempid[0], id))
                                        if (tempid[0], id, keychain, querykey, 'query') not in attributes_dep:
                                            attributes_dep.add((tempid[0], id, keychain, querykey, 'query'))
                                        if querykey not in req_key and keychain not in res_key:
                                            depid+=1
                                            req_key[querykey] = {id}
                                            req_dep[querykey] = depid
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                        elif querykey not in req_key:
                                            req_key[querykey] = {id}
                                            req_dep[querykey] = depid
                                            if tempid[0] not in res_key[keychain]:
                                                res_key[keychain].add(tempid[0])
                                        elif keychain not in res_key:
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                            if id not in req_key[querykey]:
                                                req_key[querykey].add(id)
                                        else:
                                            if id not in req_key[querykey]:
                                                req_key[querykey].add(id)
                                            if tempid[0] not in res_key[keychain]:    
                                                res_key[keychain].add(tempid[0])
                                        #print(querykey, keychain, queryvalue)
    elif path == True and '"key":' in (line):
        pathkey = line.split(':')[1].replace('"', '').replace(',','').strip()
    elif path == True and '"value":' in (line):
        pathvalue = line.split(':')[1].replace('"', '').replace(',','').strip()
        #print(pathkey, pathvalue, 'path')
        if pathvalue != '' and pathQuery == True:
            for keychain in res_set:
                            if pathvalue in res_set[keychain]:
                                for tempid in res_id[keychain]:
                                    if id != tempid[0] and pathvalue == tempid[1] and keychain not in excluded_keys:
                                        if (tempid[0], id) not in endpoints_dep:
                                            endpoints_dep.add((tempid[0], id))
                                        if (tempid[0], id, keychain, pathkey, 'path') not in attributes_dep:
                                            attributes_dep.add((tempid[0], id, keychain, pathkey, 'path'))
                                        if pathkey not in req_key and keychain not in res_key:
                                            depid+=1
                                            req_key[pathkey] = {id}
                                            req_dep[pathkey] = depid
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                        elif pathkey not in req_key:
                                            req_key[pathkey] = {id}
                                            req_dep[pathkey] = depid
                                            if tempid[0] not in res_key[keychain]:
                                                res_key[keychain].add(tempid[0])
                                        elif keychain not in res_key:
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                            if id not in req_key[pathkey]:
                                                req_key[pathkey].add(id)
                                        else:
                                            if id not in req_key[pathkey]:
                                                req_key[pathkey].add(id)
                                            if tempid[0] not in res_key[keychain]:    
                                                res_key[keychain].add(tempid[0])
                                        #print(pathkey, keychain, pathvalue)
    elif '"raw":' in (line):   
        if body == True:
            body = False
            x = line.replace('[','').replace(']','').replace('{','').replace('}','').replace('  ','').replace("\\n",'').replace('"raw":','').replace(',','').replace('\\r','').strip()
            #print(x)
            length = len(x.split(': '))
            u = 0
            for i in x.split(': '):
                #print(id)
                u=u+1
                j = i.split('\\"')
                #print(j)
                if len(j) == 3:
                    if u != length:
                        key = j[1]
                    else:
                        #print(u)
                        value = j[1]
                        if value != '':
                          for keychain in res_set:
                            if value in res_set[keychain]:
                                for tempid in res_id[keychain]:
                                    if id != tempid[0] and value == tempid[1] and keychain not in excluded_keys:
                                        if (tempid[0], id) not in endpoints_dep:
                                            endpoints_dep.add((tempid[0], id))
                                        if (tempid[0], id, keychain, key, 'body') not in attributes_dep:
                                            attributes_dep.add((tempid[0], id, keychain, key, 'body'))
                                        if key not in req_key and keychain not in res_key:
                                            depid+=1
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                        elif key not in req_key:
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            if tempid[0] not in res_key[keychain]:
                                                res_key[keychain].add(tempid[0])
                                        elif keychain not in res_key:
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                        else:
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                            if tempid[0] not in res_key[keychain]:    
                                                res_key[keychain].add(tempid[0])
                                        #print(key, keychain, value)   
                elif len(j) == 5:
                    value = j[1]
                    if value != '':
                      for keychain in res_set:
                            if value in res_set[keychain]:
                                for tempid in res_id[keychain]:
                                    if id != tempid[0] and value == tempid[1] and keychain not in excluded_keys:
                                        if (tempid[0], id) not in endpoints_dep:
                                            endpoints_dep.add((tempid[0], id))
                                        if (tempid[0], id, keychain, key, 'body') not in attributes_dep:
                                            attributes_dep.add((tempid[0], id, keychain, key, 'body'))                                     
                                        if key not in req_key and keychain not in res_key:
                                            depid+=1
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                        elif key not in req_key:
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            if tempid[0] not in res_key[keychain]:
                                                res_key[keychain].add(tempid[0])
                                        elif keychain not in res_key:
                                            res_key[keychain] = {tempid[0]}
                                            res_dep[keychain] = depid
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                        else:
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                            if tempid[0] not in res_key[keychain]:    
                                                res_key[keychain].add(tempid[0])
                                        #print(key, keychain, value)   
                    key = j[3]

# for k in res_id:
#     print(k, res_id[k])
# print('\n --- \n')
# for k in req_set:
#     print(k, req_set[k])
# print('\n --- \n')
# for k in res_set:
#     print(k, res_set[k])
# print('\n --- \n')
# for k in req_key:
#     print(k, req_key[k])
# print('\n --- \n')
# for k in res_key:
#     print(k, res_key[k])
# print('\n --- \n')
# for k in req_dep:
#     print(k, req_dep[k])
# print('\n --- \n')
# for k in res_dep:
#     print(k, res_dep[k])

sorted_endpoints_dep = sorted(endpoints_dep)
len_sorted_endpoints_dep = len(sorted_endpoints_dep)
sorted_attributes_dep = sorted(attributes_dep, key=lambda t: (t[0], t[1]))
len_sorted_attributes_dep = len(sorted_attributes_dep)
nodes = str(len(all_ids))
fileout = open('output_files/'+f.replace('.json','')+'_dependencies_'+filename+'.txt', 'w')
fileout.writelines('----------------------------------------------\n')
fileout.writelines('       Endpoint dependencies               \n')
fileout.writelines('       Number of api endpoints (nodes): '+ nodes+'\n')
fileout.writelines('       Number of dependencies (edges): '+ str(len_sorted_endpoints_dep)+'\n')
fileout.writelines('----------------------------------------------\n')
# for k in sorted_endpoints_dep:
#     print(k[0]+'  ------>  '+k[1])
nodes_set = set()
dependency_nodes = set()
dependent_nodes = set()
derive_nodes = set()
derive_dependent_nodes = set()
derive_only_nodes = set()
dependent_only_nodes = set()
for u in sorted_endpoints_dep:
    dependency_nodes.add(u[0])
    dependency_nodes.add(u[1])
    dependent_nodes.add(u[1])
    derive_nodes.add(u[0])
for u in derive_nodes:
    if u in dependent_nodes:
        derive_dependent_nodes.add(u)
    else:
        derive_only_nodes.add(u)
for u in dependent_nodes:
    if u not in derive_nodes:
        dependent_only_nodes.add(u)
    
out = ''
for k in sorted_endpoints_dep:
    if k[0] not in nodes_set:
        nodes_set.add(k[0])
        fileout.writelines(out+'\n')
        out = k[0].replace(' ','_')+'  ->  '+k[1].replace(' ','_')
    else:
        out += ' , '+ k[1].replace(' ','_')
fileout.writelines(out+'\n')

nondependentNodes = 0
for node in all_ids:
    if node not in dependency_nodes:
        nondependentNodes += 1
        fileout.writelines(node+'\n')

fileout.writelines("\n-----------List of endpoints and methods--------------\n\n")

for node in all_ids_info:
    fileout.writelines(''+node+', method: '+all_ids_info[node]+'\n')

bodycount = querycount = pathcount = 0
for d in sorted_attributes_dep:
    if d[4] == 'body':
        bodycount += 1
    elif d[4] == 'query':
        querycount += 1
    elif d[4] == 'path':
        pathcount += 1

fileout2 = open('output_files/'+f.replace('.json', '')+'_dependencies_attributes_'+filename+'.txt', 'w')
fileout2.writelines('----------------------------------------------\n')
fileout2.writelines('       Endpoint dependencies per attribute       \n')
fileout2.writelines('       Number of api endpoints (nodes): '+ nodes+'\n')
fileout2.writelines('       Number of api endpoints (nodes) with inter-dependency: '+ str(int(nodes) - nondependentNodes) +'\n')
fileout2.writelines('       Number of dependent only api endpoints (nodes): '+ str(len(dependent_only_nodes)) +'\n')
fileout2.writelines('       Number of api endpoints (nodes) that only derive dependencies: '+ str(len(derive_only_nodes)) +'\n')
fileout2.writelines('       Number of api endpoints (nodes) that are both dependent and derive dependencies: '+ str(len(derive_dependent_nodes)) +'\n')
fileout2.writelines('       Number of dependencies (edges): '+ str(len_sorted_endpoints_dep)+'\n')
fileout2.writelines('       Number of dependencies per attribute: '+ str(len_sorted_attributes_dep)+'\n')
fileout2.writelines('       Number of dependencies per parameter type (body/query/path): '+ str(bodycount)+'/'+str(querycount)+'/'+str(pathcount)+'\n')
fileout2.writelines('----------------------------------------------\n')
# for k in all_ids:
#     print(k)
attributes_frequency = {}
attribute_type = "object"

jsonObject = {"info":{
"nodes":str(nodes),
"interdependencyNodes":str(int(nodes) - nondependentNodes),
"dependentOnlyNodes":str(len(dependent_only_nodes)),
"derivingOnlyDependencyNodes":str(len(derive_only_nodes)),
"bothDependentDerivingNodes":str(len(derive_dependent_nodes)),
"edges":str(len_sorted_endpoints_dep),
"dependenciesPerAttribute":str(len_sorted_attributes_dep),
"bodyDependencies":str(bodycount),
"queryDependencies":str(querycount),
"pathDependencies":str(pathcount)
},
"endpoints": []
}
checkedNodes = set()
innerCheckedNodes = set()
jsonAdd = False
jsonInnerAdd = False
for d in sorted_attributes_dep:
    for i in res_id[d[2]]:
        if i[0] == d[0]:
            try:
                attribute_type = str(type(ast.literal_eval(i[1]))).replace("<class '", '').replace("'>",'')
            except:
                attribute_type = 'string'
            if attribute_type == 'str':
                attribute_type = 'string'
            break
    fileout2.writelines(d[0]+'  ->  '+d[1] +'  [ label = "'+d[2]+' : '+d[3] + '"] type: '+attribute_type+', parameter: '+d[4]+'\n')
    if d[0] not in checkedNodes:
        checkedNodes.add(d[0])
        jsonInnerAdd = False
        if jsonAdd == True:
            jsonAppend["dependencies"].append(jsonInner)
            jsonObject["endpoints"].append(jsonAppend)
            innerCheckedNodes.clear()
        jsonAdd = True
        jsonAppend = {
            "name":d[0],
            "method":all_ids_info[d[0]],
            "description": "" if d[0] not in all_ids_description else all_ids_description[d[0]],
            "dependencies":[]
        }
    if d[1] not in innerCheckedNodes:
        innerCheckedNodes.add(d[1])
        if jsonInnerAdd == True:
            jsonAppend["dependencies"].append(jsonInner)
        jsonInnerAdd = True
        jsonInner = {
            "name":d[1],
            "method":all_ids_info[d[1]],
            "description": "" if d[1] not in all_ids_description else all_ids_description[d[1]],
            "attributes": []
        }
    jsonInnerAttributes = {
            "fromKey":d[2],
            "toKey":d[3],
            "type":attribute_type,
            "parameter":d[4]
        }
    jsonInner["attributes"].append(jsonInnerAttributes)
    if d[3] not in attributes_frequency:
        attributes_frequency[d[3]] = 1
    else:
        attributes_frequency[d[3]] += 1
jsonAppend["dependencies"].append(jsonInner)
jsonObject["endpoints"].append(jsonAppend)
for node in all_ids:
    if node not in dependency_nodes:
        fileout2.writelines(node+'\n')
        jsonExtra = {
            "name":node,
            "method":all_ids_info[node],
            "description": "" if node not in all_ids_description else all_ids_description[node],
            "dependencies":[]
        }
        jsonObject["endpoints"].append(jsonExtra)

fileout2.writelines("\n-----------List of endpoints and methods--------------\n\n")
for node in all_ids_info:
    fileout2.writelines(''+node+', method: '+all_ids_info[node]+'\n')

if (responsebody == False):
    raise Exception("Make sure you have saved responses as examples in your collection")

print('\n----------------------------------------------\n')
attributes_frequency_sorted = sorted(attributes_frequency.items(), key=lambda x:x[1], reverse=True)
print(attributes_frequency_sorted)

fileout3 = open('output_files/jsonObject.txt', 'w')
#print(json.dumps(jsonObject, indent=4))
fileout3.writelines(json.dumps(jsonObject, indent=4))