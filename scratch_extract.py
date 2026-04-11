import os
import sys

def main():
    try:
        import PyPDF2
        import pandas as pd
        import openpyxl
    except ImportError:
        os.system(f"{sys.executable} -m pip install PyPDF2 pandas openpyxl")
        import PyPDF2
        import pandas as pd
    
    base_dir = r"C:\Proyectos\Portfolio\Pol Docs"
    out_dir = r"C:\Proyectos\Portfolio\scratch"
    os.makedirs(out_dir, exist_ok=True)
    
    for file in os.listdir(base_dir):
        path = os.path.join(base_dir, file)
        out_path = os.path.join(out_dir, file + ".txt")
        if file.endswith(".pdf"):
            with open(path, "rb") as f, open(out_path, "w", encoding="utf-8") as out:
                reader = PyPDF2.PdfReader(f)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                out.write(text)
                print(f"Extracted {file} to {out_path}")
        elif file.endswith(".xlsx"):
            with open(out_path, "w", encoding="utf-8") as out:
                try:
                    df = pd.read_excel(path).fillna("")
                    out.write(df.to_string())
                    print(f"Extracted {file} to {out_path}")
                except Exception as e:
                    print(f"Error reading {file}: {e}")

if __name__ == '__main__':
    main()
