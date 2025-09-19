#open yaml file
#dependency2.json
while True:
    f = input("Enter open api (.yaml) file:\n")
    #print(f)
    try:        
        with open('files/'+f, 'r') as file:
            # read a list of lines into data
            data = file.readlines()
            break
    except IOError:
        print("No such file")

id=-1
flag = 'null'
res_set = {}
res_id = {}
ex = False
#print(data)
# print("Your name: " + data[0])
# data[1] = 'Mage\n'
for line in data:
  if not ex:
    # if 'summary:' in (line):
    if 'post:' in line or 'get:' in line or 'put:' in line or 'delete:' in line:
        id+=1
        #id =line.split(':')[1].strip()
        #print(id)
    elif 'requestBody:' in (line):
        flag = 'req'   
    elif 'responses:' in (line):
        flag = 'res'
    elif 'example:' in (line):
        if flag == 'res':
            ex = True
            x = line
  else:
        if '"' not in line:
            ex = False
            #print(line)
            x = x.replace('[','').replace(']','').replace('{','').replace('}','').replace(' ','').replace("\\n",'').replace('example:','').replace(',','').replace('\\r','').replace("\\\n",'').strip()
            #print(x)
            length = len(x.split(':'))
            u = 0
            for i in x.split(':'):
                #print(i)
                u=u+1
                j = i.split('\\"')
                #print(j)
                if len(j) == 3:
                    if u != length:
                        key = j[1]
                        if key not in res_set:
                            res_set[key] = set()
                            res_id[key] = {id}
                        else:
                            if id not in res_id[key]:
                                res_id[key].add(id)
                    else:
                        #print(u)
                        value = j[1]
                        if value not in res_set[key]:
                            res_set[key].add(value)        
                elif len(j) == 2:
                    pass
                elif len(j) == 5:
                    value = j[1]
                    if value not in res_set[key]:
                        res_set[key].add(value)
                    #print(key, value)
                    key = j[3]
                    if key not in res_set:
                        res_set[key] = set()
                        res_id[key] = {id}
                    else:
                        if id not in res_id[key]:
                            res_id[key].add(id)
        else:
            x = x + line               

for l in res_set:
    if "''" in res_set[l]:
        res_set[l].remove('')
#     print (l, res_set[l])
# for l in res_id:
#     print (l, res_id[l])

with open('files/'+f, 'r') as file1:
    # read a list of lines into data
    data1 = file1.readlines()

id=-1
flag = 'null'
body = False
req_set = {}
req_id = {}
req_key = {}
res_key = {}
res_dep = {}
req_dep = {}
depid=0
ex=False
#print(data)
# print("Your name: " + data[0])
# data[1] = 'Mage\n'
for line in data1:
  if not ex:
    # if 'summary:' in (line):
    if 'post:' in line or 'get:' in line or 'put:' in line or 'delete:' in line:
        id+=1
        #id =line.split(':')[1].replace('"', '').replace(',','').strip()
        #print(id)
    elif 'requestBody:' in (line):
        flag = 'req'   
    elif 'responses:' in (line):
        flag = 'res'
    elif 'example:' in (line):
          if flag == 'req':
            ex = True
            x = line
            #print(x)
  else:
        if '"' not in line:
            ex = False   
            x = x.replace('[','').replace(']','').replace('{','').replace('}','').replace(' ','').replace("\\n",'').replace('example:','').replace(',','').replace('\\r','').strip()
            #print(x)
            length = len(x.split(':'))
            u = 0
            for i in x.split(':'):
                #print(id)
                u=u+1
                j = i.split('\\"')
                print(j)
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
                                    if id != tempid:
                                        if key not in req_key and keychain not in res_key:
                                            depid+=1
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            res_key[keychain] = {tempid}
                                            res_dep[keychain] = depid
                                        elif key not in req_key:
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            if tempid not in res_key[keychain]:
                                                res_key[keychain].add(tempid)
                                        elif keychain not in res_key:
                                            res_key[keychain] = {tempid}
                                            res_dep[keychain] = depid
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                        else:
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                            if tempid not in res_key[keychain]:    
                                                res_key[keychain].add(tempid)
                                        #print(key, keychain, value)   
                elif len(j) == 2:
                    pass
                elif len(j) == 5:
                  value = j[1]
                  if value != '':
                    for keychain in res_set:
                            if value in res_set[keychain]:
                                for tempid in res_id[keychain]:
                                    if id != tempid:
                                        if key not in req_key and keychain not in res_key:
                                            depid+=1
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            res_key[keychain] = {tempid}
                                            res_dep[keychain] = depid
                                        elif key not in req_key:
                                            req_key[key] = {id}
                                            req_dep[key] = depid
                                            if tempid not in res_key[keychain]:
                                                res_key[keychain].add(tempid)
                                        elif keychain not in res_key:
                                            res_key[keychain] = {tempid}
                                            res_dep[keychain] = depid
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                        else:
                                            if id not in req_key[key]:
                                                req_key[key].add(id)
                                            if tempid not in res_key[keychain]:    
                                                res_key[keychain].add(tempid)
                                        #print(key, keychain, value)   
                    key = j[3]
        else:
            x = x + line


for k in req_key:
    print(k, req_key[k])
for k in res_key:
    print(k, res_key[k])
for k in req_dep:
    print(k, req_dep[k])
for k in res_dep:
    print(k, res_dep[k])

with open('files/'+f, 'r') as file3:
        # read a list of lines into data
        data3 = file3.readlines()

name=-1
x=0
y=0
dep = {}
compset = set()
flag1 = 'null'
start = True
flag2 = 'null'
count = -1
compstr = ''
req_api = {}
res_api = {}
#sets for request and response components
for line in data3:
    count+=1
    if start:   
        if 'requestBody:' in (line):
            flag1 = 'req'
        if 'responses:' in (line):
            flag1 = 'res'   
        #if 'summary:' in (line):
        if 'post:' in line or 'get:' in line or 'put:' in line or 'delete:' in line:
            name+=1
            #x+=1
            #name = line.split(':')[1].strip()
            print(name)
        if '$ref:' in (line):
            component = line.split('/')[-1][:-2]
            if flag1 == 'req':
                req_api[component] = name
            elif flag1 == 'res':
                res_api[component] = name                    
            #print(component, x, flag1)
        if 'schemas:' in line:
            start = False
    else:
            k = line.strip()
            kminus = k[:-1]
            if kminus in req_api:
                flag2 = 'request'
                id = req_api[kminus]
                #print('yeah', req_api[kminus])
                continue
            if kminus in res_api:
                flag2 = 'response'
                id = res_api[kminus]
                continue
            if flag2 == 'response':
                    # print(k)
                    if ('type:' in k):
                        pass
                    elif ('properties:' in k):
                        pass
                    elif ('$ref' in k):
                        res_api[k.split('/')[-1][:-1]] = id
                        #print(k.split('/')[-1][:-1])        
                    else:
                        lmao = kminus
                        #print(lmao)
                        if (lmao in res_key and id in res_key[lmao]):
                            #print('yamaha')
                            if lmao not in dep:
                                y+=1
                                dep[lmao] = y
                            refstr = '           $ref: "#/components/schemas/Dependency' + str(res_dep[lmao]) +'"\n'
                            #print(refstr)
                            data3[count+1] = refstr
                            #print('ko')
                            if res_dep[lmao] not in compset:
                                compset.add(res_dep[lmao])
                                typeofdep = str(type(lmao)).replace("<class '", '').replace("'>",'')
                                if typeofdep == 'str':
                                    typeofdep = 'string'
                                compstr = compstr+"     Dependency" + str(res_dep[lmao]) + ":\n       type: object\n       properties:\n         CONTENT:\n           type:  "+typeofdep+"\n"
            elif flag2 == 'request':
                    # print(k)
                    if ('type:' in k):
                        pass
                    elif ('properties:' in k):
                        pass
                    elif ('$ref' in k):
                        req_api[k.split('/')[-1][:-1]] = id
                        #print(k.split('/')[-1][:-1])        
                    else:
                        lmao = kminus
                        #print(lmao)
                        if (lmao in req_key and id in req_key[lmao]):
                            #print('yamaha')
                            if lmao not in dep:
                                y+=1
                                dep[lmao] = y
                            refstr = '           $ref: "#/components/schemas/Dependency' + str(req_dep[lmao]) +'"\n'
                            print(refstr)
                            data3[count+1] = refstr

data3.append(compstr)
fin = 'Dep_' + f
with open('files/'+fin, 'w') as file:
    file.writelines(data3)