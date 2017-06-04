# -*- coding: utf-8 -*-
"""
Created on Sun Jul 17 16:20:08 2016

@author: yiyuezhuo
"""

import pilgrim.utils
#import helper_string
import os

from PIL import ImageFile,Image
from struct import unpack,pack

#ImageFile.LOAD_TRUNCATED_IMAGES = True

def get_image(full_path):
    #full_path = helper_string.HelperString.to_uni(full_path)

    
    decoder =  pilgrim.utils.getDecoder(full_path)
    im = decoder(full_path)
    return im

def dds_to_png(full_path, output_path):
    im = get_image(full_path)
    
    filename = os.path.basename(full_path)
    fn, ext = os.path.splitext(filename)

    im.save(os.path.join(output_path ,fn + ".png"))
    
def verify_path(path):
    if os.path.exists(path):
        return
    else:
        res, base = os.path.split(path)
        if res == '':
            os.mkdir(base)
        else:
            verify_path(res)
            os.mkdir(os.path.join(res,base))


def dds_to_png_map(root_path, root_output_path = None):
    if root_output_path == None:
        root_output_path = root_path + '_png'
    for rt, dirs, files in os.walk(root_path):
        for filename in files:
            fn, ext = os.path.splitext(filename)
            if ext == '.dds':
                full_path = os.path.join(rt, filename)
                left,right = os.path.split(full_path)
                output_path = left.replace(root_path, root_output_path)
                verify_path(output_path)
                dds_to_png(full_path, output_path)
                print('{} -> {}'.format(full_path, os.path.join(output_path, fn + '.png')))
                
def basic_load(path = 'tech_spaceport_2.dds', mode = 'RGB'):
    with open(path, 'rb') as fp:
        fp.seek(128)
        data = fp.read()
    print(mode,(52,52),len(data))
    return Image.frombytes(mode, (52, 52), data)
    
def basic_decoder(data,mode='RGB'):
    # data are bytes
    #if mode in ['RGB','RGBA']: # base
    #    return data 
    len_mode = len(mode)
    block_count = len(data)//len_mode
    assert len(data) % len_mode == 0
    
    block_list = [data[i*len_mode : (i+1)*len_mode] for i in range(block_count)]
    
    r_index = mode.index('R')
    g_index = mode.index('G')
    b_index = mode.index('B')
    
    if len_mode == 3: # RBG,BRG...
        new_block_list = [b''.join([pack('B',block[r_index]), pack('B',block[g_index]), pack('B',block[b_index])]) for block in block_list]
        
    elif len_mode == 4: #ARGB,GAGB...
        a_index = mode.index('A')
        new_block_list = [b''.join([pack('B',block[r_index]), pack('B',block[g_index]), pack('B',block[b_index]), pack('B',block[a_index])]) for block in block_list]
        
    return b''.join(new_block_list)
    
def basic_decode_load(path, mode, decode):
    with open(path, 'rb') as fp:
        fp.seek(128)
        data = fp.read()
    decode_data = basic_decoder(data,decode)
    print(mode,(52,52),len(data),len(decode_data))
    return Image.frombytes(mode, (52, 52), decode_data)
    
def basic_mask_load(data,mask):
    pass
    
def basic_detect(path):
    with open(path, 'rb') as fp:
        data = fp.read(128)
    dwSize, dwFlags, dwHeight, dwWidth, dwPitchLinear, dwDepth, dwMipMapCount, ddpfPixelFormat, ddsCaps = unpack("<IIIIIII 44x 32s 16s 4x", data[4:])
    _dwSize, _dwFlags, dwFourCC, dwRGBBitCount, dwRBitMask, dwGBitMask, dwBBitMask, dwABitMask = unpack('>IIIIIIII', ddpfPixelFormat)

    header = { "dwSize":dwSize,"dwFlags":dwFlags,"dwHeight":dwHeight,"dwWidth":dwWidth,"dwPitchLinear":dwPitchLinear,"dwDepth":dwDepth,"dwMipMapCount":dwMipMapCount,"ddpfPixelFormat":ddpfPixelFormat,"ddsCaps":ddsCaps }
    _format = {'_dwSize':_dwSize, '_dwFlags':_dwFlags, 'dwFourCC':dwFourCC, 'dwRGBBitCount':dwRGBBitCount, 'dwRBitMask':dwRBitMask, 'dwGBitMask':dwGBitMask, 'dwBBitMask':dwBBitMask, 'dwABitMask':dwABitMask}
    header['_ddpfPixelFormat'] = _format
    return header
    
def bin_int32(int32):
    s = bin(int32)[2:]
    print('0'*(32-len(s))+s)


                
if __name__ == '__main__':
    path1 = 'CG03161.dds'
    path2 = 'tech_spaceport_2.dds'
    path3 = 'tech_aura_minefield.dds'
    im1 = get_image(path1)
    im2 = get_image(path2)
    im3 = pilgrim.codecs.DDS(path1)
    im3.load = im3._loadDXTOpaque
    im4 = pilgrim.codecs.DDS(path2)
    im4.load = im4._loadDXTOpaque
    im5 = pilgrim.codecs.DDS(path1)
    im6 = pilgrim.codecs.DDS(path2)
    #im7 = pilgrim.codecs.BLP(path1)
    #im8 = pilgrim.codecs.BLP(path2)
