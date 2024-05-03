TARGET = moedo

CC = gcc

CFLAGS = -O0 -g -Wall -fno-stack-protector
LDFLAGS = -static

.PHONY: all clean

all: $(TARGET)

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)

$(TARGET): $(TARGET).o
	$(CC) -o $@ $< $(CFLAGS) $(LDFLAGS)

clean:
	rm -rf *.o $(TARGET)