<img src="Resources/UCTF.jpg" title="UCTF" alt="UCTF" data-align="center">

# Hidden Streams

Explore the available streams and consider the different types of data that can be associated with a single filename. Good luck!


# Write Up

In this write-up, we will explore how to use Microsoft PowerShell to find Alternate Data Streams (ADS) in the NTFS file system. ADS allows for the embedding of hidden data within files without altering their original content. PowerShell provides commands that can help identify and interact with ADS, making it a useful tool for forensic analysis and security assessments.

Here are the steps:

1. Locate Available Alternate Data Streams
To locate the available alternate data streams available for a file, you can use the Get-Item cmdlet with the -Stream parameter.
Below you will see the output from the Get-Item cmdlet. It lists the stream available along with the length of the stream. The flag.txt file contains two data streams: \$DATA and lookbehind.
<img src="Resources/available_alternate_data_streams.PNG" title="UCTF" alt="available ADS" data-align="center">
2. Read Alternate Data Streams
To read an alternate data stream, you can use the Get-Content cmdlet.
<img src="Resources/read_alternate_data_streams.PNG" title="UCTF" alt="read ADS" data-align="center">

# Flag

Flag is uctf{St. Mary Church}

# Categories

Check the categories which the challenge belongs to.

- [ ] Web
- [ ] Reverse
- [ ] PWN
- [ ] Misc
- [ ] Forensics
- [ ] Cryptography
- [X] Steganography

# Points

| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
| 25      |     250-300     | 500  |

# Resources

This question have a zip file that contains VHD.