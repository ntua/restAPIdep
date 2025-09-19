#open yaml file
#dependency1_forVisual.yaml
while True:
    f = input("Enter open api (.yaml) file:\n")
    #print(f)
    try:        
        #with open('files/'+f, encoding='utf8') as file:
        with open('files/'+f, 'r') as file:
            # read a list of lines into data
            data = file.readlines()
            encoding="utf8"
            break
    except IOError:
        print("No such file")
wildcard = input("Give wildcard that will be used for dependencies (e.g if 2 dependenet attributes are 'value' and 'valuegenerator' wildcard would be 'generator') (leave empty if you want to search for exact matches between attributes):\n")

x=0
flag = 'null'
start = True
req = False
#sets for request and response components
req_set = {}
res_set = {}
req_att = {}
req_att2 = {}
res_att = {}
res_att2 = {}
#print(data)
for line in data:
    if start:   
        if 'requestBody' in (line):
            flag = 'req'
        if 'responses' in (line):
            flag = 'res'   
        # if 'summary:' in (line):
        #     x = line.split(':')[1].strip()
        # if '/' in (line) and ':' in (line) and '#' not in (line) and 'http' not in (line):
        #     x = x+1
        if 'get:' in line or 'post:' in line or 'delete:' in line or 'put' in line:
            x = x+1
        if '$ref' in (line):
            component = line.split('/')[-1][:-2]
            if flag == 'req':
                req_set[component] = x
            elif flag == 'res':
                res_set[component] = x                    
            #print(component, x, flag)
        if 'schemas:' in line:
            start = False
    else:
            k = line.strip()
            kminus = k[:-1]
            if kminus in req_set:
                req = True
                id = req_set[kminus]
                #print('yeah', req_set[kminus])
                continue
            if kminus in res_set:
                req = False
                continue
            if req:
                # print(k)
                if ('type:' in k):
                    pass
                elif ('description:' in k or 'oneOf:' in k or 'items:' in k or 'default:' in k or 'enum' in k or '-' in k):
                    pass
                elif ('properties:' in k):
                    pass
                elif ('format:' in k):
                    pass
                elif ('allOf:' in k):
                    pass
                elif ('required:' in k):
                    pass
                elif (':' not in k):
                    pass
                elif ('$ref' in k):
                    req_set[k.split('/')[-1][:-1]] = id
                    #print(k.split('/')[-1][:-1])        
                else:
                    kmin = kminus.lower()
                    if kmin in req_att:
                        req_att[kmin].add(id)
                    else:    
                        req_att[kmin] = {id}
                    #print('ko')  

for i in req_set:
    print(i, req_set[i])
for i in res_set:
    print(i, res_set[i])
for i in req_att:
    print(i, req_att[i])                

start1 = True
res = False
dep = {}
simpledep = set()
y=0
compset = set()
count = -1
compstr =''
#with open('files/'+f, encoding='utf8') as file1:
with open('files/'+f, 'r') as file1:
    data1 = file1.readlines()
for line in data1:
            count += 1
            if (start1):
                if 'schemas:' in line:
                    start1 = False
            else:
                k = line.strip()
                kminus = k[:-1]
                if kminus in res_set:
                    res = True
                    id1 = res_set[kminus]
                    #print('yeah1', res_set[kminus])
                    continue
                if kminus in req_set:
                    res = False
                    continue
                if res:
                    # print(k)
                    if ('type:' in k):
                        pass
                    elif ('properties:' in k):
                        pass
                    elif ('description:' in k or 'oneOf:' in k or 'items:' in k or 'default:' in k or 'enum' in k or '-' in k):
                        pass
                    elif ('format:' in k):
                        pass
                    elif ('allOf:' in k):
                        pass
                    elif ('required:' in k):
                        pass
                    elif (':' not in k):
                        pass
                    elif ('$ref' in k):
                        res_set[k.split('/')[-1][:-1]] = id1
                        #print(k.split('/')[-1][:-1])        
                    else:
                        lmao = kminus.lower().replace(wildcard, '')
                        print(lmao)
                        if (lmao in req_att):
                            print('yamaha0', id1)
                            for tempid in req_att[lmao]:
                                if id1!=tempid:
                                    print('yamaha')
                                    if lmao in res_att:
                                        res_att[lmao].add(id1)
                                    else:
                                        res_att[lmao] = {id1}
                                    if lmao not in simpledep:
                                        y+=1
                                        dep[lmao] = y
                                        simpledep.add(lmao)
                                    refstr = '          $ref: "#/components/schemas/Dependency' + str(dep[lmao]) +'"\n'
                                    data1[count+1] = refstr
                                    #print('ko')
                                    if dep[lmao] not in compset:
                                        compset.add(dep[lmao])
                                        typeofdep = str(type(lmao)).replace("<class '", '').replace("'>",'')
                                        if typeofdep == 'str':
                                            typeofdep = 'string'
                                        compstr = compstr+"\n    Dependency" + str(dep[lmao]) + ":\n      type: object\n      properties:\n        CONTENT:\n          type:  "+typeofdep
                                    break
fin = 'Dep_' + f
with open('files/'+fin, 'w') as file:
    file.writelines(data1)
                 
# for i in dep:
#     print(i)      

start2 = True
req = False
count = -1
with open('files/'+fin, 'r') as file2:
    data2 = file2.readlines()
for line in data2:
            count += 1
            if (start2):
                if 'schemas:' in line:
                    start2 = False
            else:
                k = line.strip()
                kminus = k[:-1]
                if kminus in req_set:
                    req = True
                    id2 = req_set[kminus]
                    #print('yeah2', req_set[kminus])
                    continue
                if kminus in res_set:
                    req = False
                    continue
                if req:
                    # print(k)
                    if ('type:' in k):
                        pass
                    elif ('properties:' in k):
                        pass
                    elif ('description:' in k or 'oneOf:' in k or 'items:' in k or 'default:' in k or 'enum' in k or '-' in k):
                        pass
                    elif ('format:' in k):
                        pass
                    elif ('allOf:' in k):
                        pass
                    elif ('required:' in k):
                        pass
                    elif (':' not in k):
                        pass
                    elif ('$ref' in k):
                        pass      
                    else:
                        lmao = kminus.lower().replace(wildcard, '')
                        #print(lmao)
                        if lmao in res_att:
                            for tempid in res_att[lmao]:
                                if id!=tempid:
                                    #print('yamaha')
                                    refstr = '          $ref: "#/components/schemas/Dependency' + str(dep[lmao]) +'"\n'
                                    data2[count+1] = refstr
                                    break

data2.append(compstr)

# and write everything back
# fin = 'Dep_' + f
with open('files/'+fin, 'w') as file:
    file.writelines(data2)