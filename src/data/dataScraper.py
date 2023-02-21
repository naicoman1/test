import json

f = open('data.json')

data = json.load(f)

for data_entry in data:
    print(data)

 
# Serializing json
json_object = json.dumps(dictionary, indent=4)
 
# Writing to sample.json
with open("sample.json", "w") as outfile:
    outfile.write(json_object)