import json
from comfy.comfy_types.node_typing import IO

class ApiPlaceholder():
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "placeholder1": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder2": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder3": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder4": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder5": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder6": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder7": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder8": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder9": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder10": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder11": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder12": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder13": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder14": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder15": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder16": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder17": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder18": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder19": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "placeholder20": ("STRING", {"default": "", "multiline": False, "placeholder": "Auto-filled on connection"}),
                "connections": ("STRING", {"default": "", "multiline": True}),
                "notes": ("STRING", {"default": "", "multiline": True})
            }
        }

    RETURN_TYPES = (IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY, IO.ANY)
    FUNCTION = "main"
    OUTPUT_NODE = True

    CATEGORY = "utils"
    SEARCH_ALIASES = ["api connections", "api placeholder"]

    def main(self, placeholder1=None, placeholder2=None, placeholder3=None, placeholder4=None, placeholder5=None, placeholder6=None, placeholder7=None, placeholder8=None, placeholder9=None, placeholder10=None, placeholder11=None, placeholder12=None, placeholder13=None, placeholder14=None, placeholder15=None, placeholder16=None, placeholder17=None, placeholder18=None, placeholder19=None, placeholder20=None, connections=None, notes=None):
        value = 'None'

        return {"ui": {"text": (value,)}, "result": (connections, notes)}

NODE_CLASS_MAPPINGS = {
    "ApiPlaceholder": ApiPlaceholder,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ApiPlaceholder": "ApiPlaceholder",
}