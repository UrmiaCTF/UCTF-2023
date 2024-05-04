import sys
import numpy as np
import cv2

width, height = 8, 8
frame_rate = 10
output_filename = 'output_video.mp4'

bit_sequence = "0101010101000011010101000100011001111011010001110011000000110000011001000110001001111001001100110101111101100110011100100011000100110011011011100110010001111101"

print(len(bit_sequence))

fibonacci_sequence = [1, 1]

for i in range(3, len(bit_sequence) // 16 + 1):
    fibonacci_sequence.append(fibonacci_sequence[i - 1 - 1] + fibonacci_sequence[i - 2 - 1])

print()
def generate_video_from_string(bit_sequence):
    bit_chunks = [bit_sequence[i:i+16] for i in range(0, len(bit_sequence), 16)]

    frames = []

    for i in range(1, len(bit_chunks)):
        for _ in range(fibonacci_sequence[i - 1], 0, -1):
            frame = np.full((height, width, 3), 255, dtype=np.uint8)
            for j, bit in enumerate(bit_chunks[i - 1]):
                if bit == '1':
                    cube_color = (0, 0, 0)
                else:
                    cube_color = (255, 255, 255)

                row = j // 4
                col = j % 4

                frame[row * 2:(row + 1) * 2, col * 2:(col + 1) * 2] = cube_color
            frames.append(frame)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_filename, fourcc, frame_rate, (width , height))

    for frame in frames:
        out.write(frame)

    out.release()

    print(f"Video saved as {output_filename}")




generate_video_from_string(bit_sequence)
