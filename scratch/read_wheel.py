import pandas as pd
import json

file_path = r"G:\Mi unidad\Migracion_OneDrive\Personal\Desarrollo Personal\Mindfulness Work\Mi Rueda De La Vida.xlsx"
out_data = {}
try:
    xls = pd.ExcelFile(file_path)
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        out_data[sheet_name] = json.loads(df.to_json(orient="records", force_ascii=False))
except Exception as e:
    out_data["error"] = str(e)

with open(r"e:\Proyectos\Portfolio\scratch\wheel_data.json", "w", encoding="utf-8") as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)
