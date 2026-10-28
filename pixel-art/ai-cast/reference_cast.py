"""Pack the user-reference cast into the existing portrait interface.
Generated artwork remains unmodified; crop and scale cells for engine frames.
"""
from pathlib import Path
from functools import lru_cache
from PIL import Image
ROOT=Path(__file__).parent
CAST=('GPT','GEMINI','GLM','DEEPSEEK','CLAUDE','QWEN','GROK','META','KIMI','MINIMAX')
COLORS=((174,150,221),(113,114,205),(75,65,91),(67,132,190),(211,132,74),(74,101,175),(168,91,100),(127,167,207),(75,76,124),(204,110,153))
@lru_cache(maxsize=2)
def sheet(talking):
    p=ROOT/('all-models-talk.png' if talking else 'all-models-neutral.png')
    return Image.open(p).convert('RGBA')
class ReferenceActor:
    expr='neutral'
    def __init__(self,key):self.index=CAST.index(key)
    @property
    def walker(self):return COLORS[self.index],COLORS[self.index]
    def sprite(self,expr=None,**kw):
        im=sheet(expr=='talk')
        # Integer proportional grid boundaries avoid dropping remainder pixels.
        col,row=self.index%5,self.index//5
        inset=round(im.width/5*0.035)
        box=(round(col*im.width/5)+inset,round(row*im.height/2)+5,round((col+1)*im.width/5)-inset,round((row+1)*im.height/2)-5)
        portrait=im.crop(box).resize((124,124),Image.Resampling.NEAREST)
        frame=Image.new('RGBA',(180,128))
        frame.paste(portrait,(28,4))
        return frame
