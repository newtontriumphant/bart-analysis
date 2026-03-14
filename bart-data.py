import requests, xml.etree.ElementTree as ET

# public api key, im not stupid
url = "https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V"

try:
    data = requests.get(url + "&json=y").json()
    stations = data["root"]["stations"]["station"]
    get = lambda s, k: s[k]
except Exception:
    root = ET.fromstring(requests.get(url).text)
    stations = root.findall(".//station")
    get = lambda s, k: s.find(k).text

print("const BART_STATIONS = {")
for s in stations:
    abbr = get(s, "abbr")
    key = f"'{abbr}'" if abbr[0].isdigit() else abbr
    name = get (s, "name").replace("'", "\\'")
    print(f"  {key}: {{ name:'{name}', lat:{get(s,'gtfs_latitude')}, lng:{get(s,'gtfs_longitude')} }},")
print("};")