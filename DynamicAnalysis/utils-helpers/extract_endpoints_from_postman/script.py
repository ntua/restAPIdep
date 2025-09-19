import glob
import json
from colorama import Fore, Style

# ask user to provide the path of the postman collection file
while True:
    user_input = input('Enter the path of the postman collection file: ')
    name = user_input.split('/')[-1]
    if len(name.split("."))==1:
        print(Fore.RED+'add the file extension ')
        print(Style.RESET_ALL)
    elif not name.endswith('json'):
        print(Fore.RED+'wrong file format:', name.split(".")[-1], 'instead of json')
        print(Style.RESET_ALL)
    else:
        input_path_list = glob.glob(user_input, recursive=True)
        if len(input_path_list)==0:
            print(Fore.RED+'file not found')
            print(Style.RESET_ALL)
        else:
            input_path = input_path_list[0]
            break


# ask user to provide the desired endpoints
desired_endpoints = input('Enter the names of the endpoints you want to keep (separated by &): ').split("&")
tag = input('Provide a tag to identify the reduced postman collection: ')

postman_collection = eval(open(input_path, 'r').read(), {'true':True, 'false':False, 'null': {}})



# keep only the desired endpoints
def parse_and_reduce_collection(collection):
    items = collection['item'] 
    non_desired_items=[]
    # item is either a folder (sub-collection) or a request
    for item in items:
        if 'request' in item: # item is a request
            if item['name'] not in desired_endpoints: 
                non_desired_items.append(item)
        else: # item is a folder (sub-collection)
            parse_and_reduce_collection(item)
    for non_desired_item in non_desired_items:
        items.pop(items.index(non_desired_item))
    return collection


output_file = open("./output_files/postman_collection_reduced_{}.json".format(tag), "w")
output_file.write(str(json.dumps(parse_and_reduce_collection(postman_collection))))
output_file.close()