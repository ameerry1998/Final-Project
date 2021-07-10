import json


def load_data(path: str) -> None:
  """Converts the raw dictionary file into a mongo-ready json file"""
  data = json.load(open(path, "r"))
  wordID = 0
  d2 = dict()
  for key in data:
      if "-" not in key:
          d2.update(
              {wordID: {"word": key, "definition": data[key], "length": len(key)}}
          )
          wordID += 1

  with open("dictionary-modified-python-scr.json", "w") as outfile:
      outfile.write(json.dumps(d2, indent=4))

if __name__ == "__main__":
  load_data(input("path to json dict:"))