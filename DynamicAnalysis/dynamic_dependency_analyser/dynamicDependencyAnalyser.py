import glob
from colorama import Fore, Style
from utils import is_nested_obj, parse_nested_obj, compute_and_analyse_dependency_graph, produce_output


# ask user to provide the name of the json input file
while True:
    user_input = input('Enter the path to the .json input file: ')
    if len(user_input.split("."))==1:
        print(Fore.RED+'add the file extension ')
        print(Style.RESET_ALL)
    elif not user_input.endswith('json'):
        print(Fore.RED+'wrong file format:', user_input.split(".")[-1], 'instead of json')
        print(Style.RESET_ALL)
    else:
        input_path_list = glob.glob(user_input, recursive=True)

        if len(input_path_list)==0:
            print(Fore.RED+'file not found')
            print(Style.RESET_ALL)
        elif len(input_path_list)>1:
            print(Fore.RED+'this filename is not unique',input_path_list)
            print(Style.RESET_ALL)
        else:
            input_path = input_path_list[0]
            break

# ask user whether to check for dependencies related to query params 
while True:
    user_input = input('Include query parameters? (yes/no) [default: yes]: ')
    if user_input == "yes" or user_input == "y" or user_input == "":
        includeQueryParams = True
        break
    elif user_input == "no" or user_input == "n":
        includeQueryParams = False
        break

# ask user whether to take path params into consideration
# (!) : each part of the path is considered as a path param, because it 
# is not possible to extract the path params from the path
# this can lead to misleading results
while True:
    user_input = input('Consider path parameters ? (may produce misleading results) [yes/no, default: yes]: ')
    if user_input == "yes" or user_input == "y" or user_input == "":
        include_path = True
        break
    elif user_input == "no" or user_input == "n":
        include_path = False
        break

# ask user whether to check only for dependencies starting from GET requests
# (these dependencies are likely to make more sense) 
while True:
    user_input = input('Compute dependencies starting only from endpoints with method "GET"? [yes/no, default: no]: ')
    if user_input == "yes" or user_input == "y":
        get_method = True
        break
    elif user_input == "no" or user_input == "n" or user_input == "":
        get_method = False
        break

# ask user whether to take boolean values into consideration
# this can lead to misleading results
while True:
    user_input = input('Include boolean values in dependency analysis? (may produce misleading results) [yes/no, default: no]: ')
    if user_input == "yes" or user_input == "y":
        include_boolean = True
        break
    elif user_input == "no" or user_input == "n" or user_input == "":
        include_boolean = False
        break

# ask user whether to be strict with datatypes
# (for example, can a dependency include the values 17 (int) and "17" (string) ?)
while True:
    user_input = input('Use strict type matching? (treat values of different types as distinct) (yes/no) [default: yes]')
    if user_input == "yes" or user_input == "y" or user_input == "":
        strict_types= True
        break
    elif user_input == "no" or user_input == "n":
        strict_types = False
        break


# read list of requests stored by mim (i.e. json file exported from MongoDB)
with open(input_path, 'r', encoding='utf-8') as f:
    content = f.read().replace('"true"', '"True"')
input_list = eval(content, {'true': True, 'false': False, 'null': None})

# add increasing sequence numbers to the requests of each use case
# so that we look for dependencies between req1 and req2, where req2 follows req1 in the use case
reqs_per_usecase={}
tag = None
seq_number = None
for req in input_list:
    if req['tag']!=tag:
        seq_number = 0
        tag=req['tag']
    req['seq_number'] = seq_number
    seq_number+=1

# store information about every attribute value encountered in a request or response : endpoint, method, attribute name, ...
#   req_values (res_values) : 
#       dict with key=<attribute value> and value=<list of endpoints (+ metadata) into the req (res) body (or params) of which this value was found>
req_values={}
res_values={} 
for request in input_list:
    if 'body' in request:
        req_body = request['body']
        if is_nested_obj(req_body):
            req_values=parse_nested_obj(req_body,'req',{'endpoint':request['endpoint'], 'method': request['method'], 'seq_number': request['seq_number'], 'usecase': request['tag']},req_values,res_values,[])['reqbody_values']
    if 'response' in request:
        res_body = request['response']
        res_body_schema = res_body['requestSchema']
        if is_nested_obj(res_body_schema):
            res_values=parse_nested_obj(res_body_schema,'res',{'endpoint':request['endpoint'], 'method': request['method'], 'seq_number': request['seq_number'], 'usecase': request['tag']},req_values,res_values,[])['resbody_values']
    # we can also store information about query params values
    if 'query' in request and includeQueryParams:
        queryParams = request['query']
        for queryParam in queryParams:
            attribute_info={}
            attribute_info['name'] = queryParam
            attribute_info['path'] = 'url->'+queryParam
            attribute_info['type_of_param'] = "query"
            attribute_info['type'] = "string"
            if queryParams[queryParam] not in req_values:
                req_values[queryParams[queryParam]]=[]
            req_values[queryParams[queryParam]].append({'request_info': {'endpoint':request['endpoint'], 'method': request['method'], 'seq_number': request['seq_number'], 'usecase': request['tag']}, 'attribute_info': attribute_info })
    if include_path:
        path = request['params']
        for param in path:
            attribute_info={}
            attribute_info['name'] = param
            attribute_info['path'] = 'url->'+param
            attribute_info['type_of_param'] = "path"
            attribute_info['type'] = "string"
            if param not in req_values:
                req_values[param]=[]
            req_values[param].append({'request_info': {'endpoint':request['endpoint'], 'method': request['method'], 'seq_number': request['seq_number'], 'usecase': request['tag']}, 'attribute_info': attribute_info })

# compute dependency graph and produce the output .json file
input_filename = input_path.split("\\")[-1].split(".")[0]
produce_output(compute_and_analyse_dependency_graph(req_values,res_values,get_method,include_boolean, strict_types), f'{input_filename}_deps')

