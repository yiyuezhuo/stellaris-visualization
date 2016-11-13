# Stellaris Data Visualization

Paradox's excelent game Stellaris setting data file viaualization project.

## DDS to PNG

Stellaris use non-compressed `.dds` file save image. I forked python package `pilgrim` and add 
function to do it.

https://github.com/yiyuezhuo/pilgrim

then call `dds_to_png.py` as:

```python
dds_to_png_map(input_path, output_path)
```

## Technology Dependency Force Graph

Created by `d3.js`.

<img src="preview/2.png">