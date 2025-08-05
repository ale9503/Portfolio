import os
import pandas as pd
import json

def excel_to_json(excel_path: str, json_path: str):
    df = pd.read_excel(excel_path)
    records = df.to_dict(orient='records')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"Convertido: '{excel_path}' → '{json_path}'")

if __name__ == '__main__':
    # Calcula la carpeta donde está este script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    excel_file = os.path.join(script_dir, 'DetallePortafolio.xlsx')
    json_file  = os.path.join(script_dir, 'DetallePortafolio.json')

    # Verificamos primero si existe
    if not os.path.isfile(excel_file):
        print(f"ERROR: No existe el archivo:\n  {excel_file}")
        print("Coloca 'DetallePortafolio.xlsx' junto a este script y vuélvelo a ejecutar.")
        exit(1)

    excel_to_json(excel_file, json_file)
