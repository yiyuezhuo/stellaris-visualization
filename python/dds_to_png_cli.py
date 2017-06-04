# -*- coding: utf-8 -*-
"""
Created on Sun Jun  4 16:06:11 2017

@author: yiyuezhuo
"""

import argparse
import os
import dds_to_png

parser = argparse.ArgumentParser(usage=u'python dds_to_png_cli.py root_path root_output_path',
                                 description=u"Stellaris dds file to png transform script")
parser.add_argument('root_path', help=u'Stellaris technologies icon file directory. Example: E:\steam\steamapps\common\Stellaris\gfx\interface\icons\technologies')
parser.add_argument('root_output_path' ,help=u"The save directory for transformed png files. Example: 20170604")
args=parser.parse_args()
os.makedirs(args.root_output_path, exists_ok=True)
dds_to_png.dds_to_png_map(args.root_path, args.root_output_path)