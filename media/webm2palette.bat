ffmpeg -y -i output.webm -vf fps=25,scale=490:-1:flags=lanczos,palettegen palette.png
pause