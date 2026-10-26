from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
FONT_BOLD = Path("C:/Windows/Fonts/arialbd.ttf")
FONT_REGULAR = Path("C:/Windows/Fonts/arial.ttf")

canvas = Image.new("RGB", (1200, 630), "#09090b")
draw = ImageDraw.Draw(canvas)
draw.line((0, 500, 1200, 130), fill="#27272a", width=2)
draw.text((82, 142), "L E O N A R D O   L A B S", fill="#a1a1aa", font=ImageFont.truetype(FONT_REGULAR, 27))
draw.text((78, 248), "CNPJ Premium", fill="#ffffff", font=ImageFont.truetype(FONT_BOLD, 112))
draw.text((85, 405), "Consulta empresarial clara e organizada.", fill="#a1a1aa", font=ImageFont.truetype(FONT_REGULAR, 40))
canvas.save(PUBLIC / "og-image.png", optimize=True)

icon = Image.new("RGB", (180, 180), "#09090b")
icon_draw = ImageDraw.Draw(icon)
icon_draw.rounded_rectangle((0, 0, 179, 179), radius=40, fill="#09090b")
icon_draw.polygon(((48, 54), (132, 54), (132, 77), (76, 77), (76, 103), (132, 103), (132, 126), (48, 126)), fill="#ffffff")
icon_draw.ellipse((116, 38, 150, 72), fill="#a1a1aa")
icon.save(PUBLIC / "apple-touch-icon.png", optimize=True)
