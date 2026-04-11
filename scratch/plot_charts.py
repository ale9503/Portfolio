import matplotlib.pyplot as plt
import numpy as np
import os

out_dir = r"C:\Users\ale95\.gemini\antigravity\brain\72407a73-4a18-4daf-bb94-c0f3535a9ede"

# 1. RADAR CHART (Atributos)
labels = ['Éxito financiero', 'Autoridad', 'Outsider', 'Empatía social', 'Experiencia pública']
num_vars = len(labels)
angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
angles += angles[:1]

candidates = {
    'Abelardo de la Espriella': [95, 88, 75, 25, 10],
    'Paloma Valencia': [85, 90, 30, 60, 85],
    'Sergio Fajardo': [70, 65, 50, 80, 95],
    'Iván Cepeda': [20, 85, 40, 95, 90]
}
colors = ['#c0392b', '#2980b9', '#f39c12', '#27ae60']

fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
for i, (name, values) in enumerate(candidates.items()):
    val = values + values[:1]
    ax.plot(angles, val, color=colors[i], linewidth=2, label=name)
    ax.fill(angles, val, color=colors[i], alpha=0.1)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(labels, fontsize=11)
ax.set_yticks([20, 40, 60, 80, 100])
ax.set_yticklabels(['20', '40', '60', '80', '100'], color="grey", size=8)
ax.set_ylim(0, 100)
plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
plt.title('Atributos Percibidos (0-100)', size=15, weight='bold', position=(0.5, 1.1))
plt.tight_layout()
plt.savefig(os.path.join(out_dir, 'radar_atributos.png'), dpi=150)
plt.close()

# 2. BAR CHART (Ejes de Discurso)
ejes_data = {
    'Abelardo': [('Seguridad', 95), ('Libre mercado', 90), ('Rev. Punitiva', 85), ('P. Social', 30)],
    'Paloma': [('Seguridad', 95), ('D. Privado', 90), ('P. Familiar', 70), ('Educación', 60)],
    'Fajardo': [('Educación', 95), ('P. Social', 85), ('Tributación', 75), ('Infraestr.', 70)],
    'Cepeda': [('Anticorrupción', 95), ('P. Social', 90), ('Rev. Agraria', 85), ('Merc. Regulado', 60)]
}

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle('Ejes del Discurso por Candidato (%)', fontsize=16, weight='bold')

axes = axes.flatten()
for i, (name, axes_c) in enumerate(ejes_data.items()):
    labels_c = [x[0] for x in axes_c]
    vals_c = [x[1] for x in axes_c]
    axes[i].barh(labels_c, vals_c, color=colors[i])
    axes[i].set_title(name, fontsize=14)
    axes[i].set_xlim(0, 100)
    for index, value in enumerate(vals_c):
        axes[i].text(value + 2, index, str(value)+'%', va='center', ha='left', fontsize=10)
    axes[i].invert_yaxis()

plt.tight_layout(rect=[0, 0.03, 1, 0.95])
plt.savefig(os.path.join(out_dir, 'barras_ejes.png'), dpi=150)
plt.close()
