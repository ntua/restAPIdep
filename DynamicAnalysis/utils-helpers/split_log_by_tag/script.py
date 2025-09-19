import glob
import json
from colorama import Fore, Style


# ask user to provide the name of the initial mim log 
while True:
    user_input = input('Enter the path to the .json input file (man-in-the-middle log): ')
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

# read list of requests stored by mim (i.e. json file exported from MongoDB)
with open(input_path, 'r', encoding='utf-8') as f:
    content = f.read().replace('"true"', '"True"')
input_list = eval(content, {'true': True, 'false': False, 'null': None})

requests_per_usecase = {}
for request in input_list:
    if request['tag'] not in requests_per_usecase:
        requests_per_usecase[request['tag']]=[]
    requests_per_usecase[request['tag']].append(request)

input_filename = input_path.split("\\")[-1].split(".")[0]

for tag in requests_per_usecase:
    output_file = open("./output_files/{}_{}.json".format(input_filename,tag), "w")
    output_file.write(str(json.dumps(requests_per_usecase[tag])))
    output_file.close()