"""Slice generated 3x2 animation sheets, register frames and freeze non-facial art.
User requested generated sequential art followed by cropping. Source sheets stay intact.
"""
from pathlib import Path
import argparse,json
import numpy as np
from scipy.ndimage import label, binary_dilation
from PIL import Image, ImageFilter, ImageDraw

parser=argparse.ArgumentParser()
parser.add_argument('source',type=Path)
parser.add_argument('output',type=Path)
args=parser.parse_args()
args.output.mkdir(parents=True,exist_ok=True)
im=Image.open(args.source).convert('RGBA')
frames=[]
# Fixed grid cropping preserves each frame's common coordinate system.
for row in range(2):
 for col in range(3):
  x0,y0=round(col*im.width/3),round(row*im.height/2)
  x1,y1=round((col+1)*im.width/3),round((row+1)*im.height/2)
  frames.append(im.crop((x0,y0,x1,y1)))
# One union crop and one scale for all cells: never independently resize expressions.
boxes=[f.getchannel('A').point(lambda a:255 if a>80 else 0).getbbox() for f in frames]
boxes=[b for b in boxes if b]
union=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
ratio=min(120/(union[2]-union[0]),120/(union[3]-union[1]))
for i,f in enumerate(frames):
 f=f.crop(union).resize((round((union[2]-union[0])*ratio),round((union[3]-union[1])*ratio)),Image.Resampling.LANCZOS)
 out=Image.new('RGBA',(124,124));out.paste(f,((124-f.width)//2,124-f.height));frames[i]=out
# Register opaque hair/clothing, excluding central expression region.
a=np.asarray(frames[0]).astype(float)
mask=(a[:,:,3]>150).astype(float);mask[25:88,25:100]=0
shifts=[]
for i,f in enumerate(frames):
 if i==0:shifts.append((0,0));continue
 best=(float('inf'),0,0)
 for dy in range(-5,6):
  for dx in range(-5,6):
   moved=Image.new('RGBA',(124,124));moved.paste(f,(dx,dy));b=np.asarray(moved).astype(float)
   score=np.sum(np.mean((a[:,:,:3]-b[:,:,:3])**2,axis=2)*mask)/max(1,mask.sum())
   if score<best[0]:best=(score,dx,dy)
 moved=Image.new('RGBA',(124,124));moved.paste(f,best[1:]);frames[i]=moved;shifts.append(best[1:])
for i,f in enumerate(frames):f.save(args.output/f'raw-{i}.png')
# Keep the generated neutral hair/body exactly fixed; only use generated facial pixels.
face_mask=Image.new('L',(124,124));ImageDraw.Draw(face_mask).ellipse((37,39,87,79),fill=255)
face_mask=face_mask.filter(ImageFilter.GaussianBlur(1))
base=frames[0]
for i in range(1,6):frames[i]=Image.composite(frames[i],base,face_mask)
# GPT's generated face drifts relative to its hair: register expression patches
# independently. Speaking changes only the mouth; blinking changes only the eyes.
if args.output.name.lower()=='gpt':
 patches={1:((1,0),'eyes'),2:((4,-2),'eyes'),3:((0,-1),'eyes'),4:((0,0),'mouth'),5:((2,1),'mouth')}
 for i,(shift,kind) in patches.items():
  raw=Image.open(args.output/f'raw-{i}.png').convert('RGBA')
  aligned=Image.new('RGBA',(124,124));aligned.paste(raw,shift)
  patch=Image.new('L',(124,124));draw=ImageDraw.Draw(patch)
  if kind=='eyes':
   draw.ellipse((48,48,66,62),fill=255);draw.ellipse((70,55,86,68),fill=255)
  else:draw.ellipse((58,64,71,74),fill=255)
  patch=patch.filter(ImageFilter.GaussianBlur(.5))
  frames[i]=Image.composite(aligned,base,patch)
# Discard detached neighboring-cell fragments, preserving the silhouette's alpha fringe.
components,count=label(np.asarray(base)[:,:,3]>40)
areas=np.bincount(components.ravel());areas[0]=0
keep=binary_dilation(components==int(areas.argmax()),iterations=2)
for i,f in enumerate(frames):
 pixels=np.array(f);pixels[~keep]=0;frames[i]=Image.fromarray(pixels)
 frames[i].save(args.output/f'frame-{i}.png')
preview=Image.new('RGBA',(124*3,124*2))
for i,f in enumerate(frames):preview.paste(f,((i%3)*124,(i//3)*124))
preview.save(args.output/'registered-sheet.png')
gif=[]
for i in [0,1,2,3,0,4,5,4,5,0]:
 bg=Image.new('RGBA',(124,124),(37,62,93,255));bg.alpha_composite(frames[i]);gif.append(bg.convert('RGB').resize((372,372),Image.Resampling.NEAREST))
gif[0].save(args.output/'preview.gif',save_all=True,append_images=gif[1:],duration=[1400,70,100,70,900,130,130,130,130,900],loop=0,disposal=2)
(args.output/'registration.json').write_text(json.dumps({'source':args.source.name,'crop':union,'shifts':shifts},indent=2))
print(args.output/'registered-sheet.png')
