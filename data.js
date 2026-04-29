const questions = [
  {
    id: 1,
    topic: 'Module 16-17',
    question: 'Which component is designed to protect against unauthorized communications to and from a computer?',
    answers: ['security center', 'port scanner', 'antimalware', 'antivirus', 'firewall'],
    correctIndex: 4,
    explanation: 'Topic 16.3.5'
  },
  {
    id: 2,
    topic: 'Module 16-17',
    question: 'Which command will block login attempts on RouterA for a period of 30 seconds if there are 2 failed login attempts within 10 seconds?',
    answers: [
      'RouterA(config)# login block-for 10 attempts 2 within 30',
      'RouterA(config)# login block-for 30 attempts 2 within 10',
      'RouterA(config)# login block-for 2 attempts 30 within 10',
      'RouterA(config)# login block-for 30 attempts 10 within 2'
    ],
    correctIndex: 1,
    explanation: 'Topic 16.4.3'
  },
  {
    id: 3,
    topic: 'Module 16-17',
    question: 'What is the purpose of the network security accounting function?',
    answers: [
      'to require users to prove who they are',
      'to determine which resources a user can access',
      'to keep track of the actions of a user',
      'to provide challenge and response questions'
    ],
    correctIndex: 2,
    explanation: 'Topic 16.3.4'
  },
  {
    id: 4,
    topic: 'Module 16-17',
    question: 'What type of attack may involve the use of tools such as nslookup and fping?',
    answers: ['access attack', 'reconnaissance attack', 'denial of service attack', 'worm attack'],
    correctIndex: 1,
    explanation: 'Topic 16.2.2'
  },
  {
    id: 5,
    topic: 'Module 16-17',
    type: 'match',
    question: 'Match each weakness with an example. (Not all options are used.)',
    pairs: [
      { category: 'security policy weakness', option: 'The network administrator did not fully consider the implications of unauthorized users accessing the network.' },
      { category: 'configuration weakness',   option: 'When implementing an access list on a router, a network engineer did not filter a type of malicious traffic.' },
      { category: 'technological weakness',   option: 'A network engineer is examining the operating system of a network device for vulnerabilities.' }
    ],
    explanation: 'Topic 16.1.2 - An employee who is trying to guess the password of another user exemplifies not a weakness but an attack.'
  },
  {
    id: 6,
    topic: 'Module 16-17',
    type: 'match',
    question: 'Match the type of information security threat to the scenario. (Not all options are used.)',
    pairs: [
      { category: 'information theft',    option: 'Obtaining trade secret documents illegally.' },
      { category: 'identity theft',       option: 'Pretending to be someone else by using stolen personal information to apply for a credit card.' },
      { category: 'data loss',            option: 'Installing virus code to destroy surveillance recordings for certain days.' },
      { category: 'disruption of service', option: 'Preventing users from accessing a website by sending a large number of link requests in a short period.' }
    ],
    explanation: 'Topic 16.1.2 - Common network threats: information theft, identity theft, data loss or manipulation, disruption of service.'
  },
  {
    id: 7,
    topic: 'Module 16-17',
    question: 'Which example of malicious code would be classified as a Trojan horse?',
    answers: [
      'malware that was written to look like a video game',
      'malware that requires manual user intervention to spread between systems',
      'malware that attaches itself to a legitimate program and spreads to other programs when launched',
      'malware that can automatically spread from one system to another by exploiting a vulnerability in the target'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.2.1 - A Trojan horse is malicious code written specifically to look like a legitimate program.'
  },
  {
    id: 8,
    topic: 'Module 16-17',
    question: 'What is the difference between a virus and a worm?',
    answers: [
      'Viruses self-replicate but worms do not.',
      'Worms self-replicate but viruses do not.',
      'Worms require a host file but viruses do not.',
      'Viruses hide in legitimate programs but worms do not.'
    ],
    correctIndex: 1,
    explanation: 'Topic 16.2.1 - Worms are able to self-replicate and exploit vulnerabilities on computer networks without user participation.'
  },
  {
    id: 9,
    topic: 'Module 16-17',
    question: 'Which attack involves a compromise of data that occurs between two end points?',
    answers: ['denial-of-service', 'man-in-the-middle attack', 'extraction of security parameters', 'username enumeration'],
    correctIndex: 1,
    explanation: 'Topic 16.2.3'
  },
  {
    id: 10,
    topic: 'Module 16-17',
    question: 'Which type of attack involves an adversary attempting to gather information about a network to identify vulnerabilities?',
    answers: ['reconnaissance', 'DoS', 'dictionary', 'man-in-the-middle'],
    correctIndex: 0,
    explanation: 'Topic 16.2.2 - Reconnaissance is a type of attack where the intruder is looking for wireless network vulnerabilities.'
  },
  {
    id: 11,
    topic: 'Module 16-17',
    type: 'match',
    question: 'Match the description to the type of firewall filtering. (Not all options are used.)',
    pairs: [
      { category: 'stateful packet inspection', option: 'Prevents or allows access based on whether the traffic is in response to requests from internal hosts.' },
      { category: 'URL filtering',              option: 'Prevents or allows access based on web addresses or keywords.' },
      { category: 'application filtering',      option: 'Prevents or allows access based on the port numbers used in the request.' },
      { category: 'packet filtering',           option: 'Prevents or allows access based on the IP or MAC addresses of the source and destination.' }
    ],
    explanation: 'Topic 16.3.6'
  },
  {
    id: 12,
    topic: 'Module 16-17',
    question: 'What is the purpose of the network security authentication function?',
    answers: [
      'to require users to prove who they are',
      'to determine which resources a user can access',
      'to keep track of the actions of a user',
      'to provide challenge and response questions'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.3.4 - Authentication requires users to prove who they are. Authorization determines which resources the user can access. Accounting keeps track of the actions of the user.'
  },
  {
    id: 13,
    topic: 'Module 16-17',
    question: 'Which firewall feature is used to ensure that packets coming into a network are legitimate responses to requests initiated from internal hosts?',
    answers: ['stateful packet inspection', 'URL filtering', 'application filtering', 'packet filtering'],
    correctIndex: 0,
    explanation: 'Topic 16.3.6 - Stateful packet inspection checks that incoming packets are actually legitimate responses to requests originating from hosts inside the network.'
  },
  {
    id: 14,
    topic: 'Module 16-17',
    question: 'When applied to a router, which command would help mitigate brute-force password attacks against the router?',
    answers: [
      'exec-timeout 30',
      'service password-encryption',
      'banner motd $Max failed logins = 5$',
      'login block-for 60 attempts 5 within 60'
    ],
    correctIndex: 3,
    explanation: 'Topic 16.4.3 - The login block-for command sets a limit on the maximum number of failed login attempts allowed within a defined period of time.'
  },
  {
    id: 15,
    topic: 'Module 16-17',
    type: 'multiselect',
    question: 'Identify the steps needed to configure a switch for SSH. Select all that apply. (Not all options are used.)',
    answers: [
      'Create a local user.',
      'Generate RSA keys.',
      'Use the login command.',
      'Configure a domain name.',
      'Use the login local command.',
      'Use the password cisco command.',
      'Use the transport input ssh command.'
    ],
    correctIndexes: [0, 1, 3, 4, 6],
    correctIndex: 0,
    explanation: 'Topic 16.4.4 - The 5 required steps are: create a local user, generate RSA keys, configure a domain name, use the login local command, and use the transport input ssh command. The "login" and "password cisco" commands are used for Telnet, not SSH.'
  },
  {
    id: 16,
    topic: 'Module 16-17',
    question: 'What feature of SSH makes it more secure than Telnet for a device management connection?',
    answers: [
      'confidentiality with IPsec',
      'stronger password requirement',
      'random one-time port connection',
      'login information and data encryption'
    ],
    correctIndex: 3,
    explanation: 'Topic 16.4.4 - SSH provides security by providing encryption for both authentication (username and password) and the transmitted data.'
  },
  {
    id: 17,
    topic: 'Module 16-17',
    question: 'What is the advantage of using SSH over Telnet?',
    answers: [
      'SSH is easier to use.',
      'SSH operates faster than Telnet.',
      'SSH provides secure communications to access hosts.',
      'SSH supports authentication for a connection request.'
    ],
    correctIndex: 2,
    explanation: 'Topic 16.4.4 - SSH provides a secure method for remote access to hosts by encrypting network traffic between the SSH client and remote hosts.'
  },
  {
    id: 18,
    topic: 'Module 16-17',
    question: 'What is the role of an IPS?',
    answers: [
      'detecting and blocking of attacks in real time',
      'connecting global threat information to Cisco network security devices',
      'authenticating and validating traffic',
      'filtering of nefarious websites'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.3.4 - An intrusion prevention system (IPS) provides real-time detection and blocking of attacks.'
  },
  {
    id: 19,
    topic: 'Module 16-17',
    question: 'A user deploys a new application-aware firewall, installs a second firewall to separate the company network from the public network, and installs an IPS on the internal network. What approach is the user implementing?',
    answers: ['attack based', 'risk based', 'structured', 'layered'],
    correctIndex: 3,
    explanation: 'Topic 16.3.1 - Using different defenses at various points of the network creates a layered approach.'
  },
  {
    id: 20,
    topic: 'Module 16-17',
    question: 'What is an accurate description of redundancy?',
    answers: [
      'configuring a router with a complete MAC address database to ensure that all frames can be forwarded to the correct destination',
      'configuring a switch with proper security to ensure that all traffic forwarded through an interface is filtered',
      'designing a network to use multiple virtual devices to ensure that all traffic uses the best path through the internetwork',
      'designing a network to use multiple paths between switches to ensure there is no single point of failure'
    ],
    correctIndex: 3,
    explanation: 'Topic 17.1.4 - Redundancy attempts to remove any single point of failure in a network by using multiple physically cabled paths between switches in the network.'
  }
  ,
  {
    id: 21,
    topic: 'Module 16-17',
    type: 'multiselect',
    question: 'A network administrator is upgrading a small business network to give high priority to real-time applications traffic. What two types of network services is the network administrator trying to accommodate? (Choose two.)',
    answers: ['voice', 'video', 'instant messaging', 'FTP', 'SNMP'],
    correctIndexes: [0, 1],
    correctIndex: 0,
    explanation: 'Topic 17.1.5 - Streaming media such as video and voice traffic are both examples of real-time traffic sensitive to network delay and latency.'
  },
  {
    id: 22,
    topic: 'Module 16-17',
    question: 'What is the purpose of a small company using a protocol analyzer utility to capture network traffic on the network segments where the company is considering a network upgrade?',
    answers: [
      'to identify the source and destination of local network traffic',
      'to capture the Internet connection bandwidth requirement',
      'to document and analyze network traffic requirements on each network segment',
      'to establish a baseline for security analysis after the network is upgraded'
    ],
    correctIndex: 2,
    explanation: 'Topic 17.3.2 - By using a protocol analyzer in each network segment, the network administrator can document and analyze the network traffic pattern for each segment.'
  },
  {
    id: 23,
    topic: 'Module 16-17',
    question: 'An administrator is testing connectivity to a remote device with the IP address 10.1.1.1. The output shows all periods (.). What does this indicate?',
    answers: [
      'Connectivity to the remote device was successful.',
      'A router along the path did not have a route to the destination.',
      'A ping packet is being blocked by a security device along the path.',
      'The connection timed out while waiting for a reply from the remote device.'
    ],
    correctIndex: 3,
    explanation: 'Topic 17.4.1 - A period (.) indicates that the connection timed out while waiting for a reply. "!" = success, "U" = no route to destination.'
  },
  {
    id: 24,
    topic: 'Module 16-17',
    question: 'Which method is used to send a ping message specifying the source address for the ping?',
    answers: [
      'Issue the ping command from within interface configuration mode.',
      'Issue the ping command without specifying a destination IP address.',
      'Issue the ping command without extended commands.',
      'Issue the ping command after shutting down un-needed interfaces.'
    ],
    correctIndex: 1,
    explanation: 'Topic 17.4.2 - By issuing the ping command without a destination IP address in privileged EXEC mode, the Cisco IOS enters extended ping mode which includes source IP address options.'
  },
  {
    id: 25,
    topic: 'Module 16-17',
    question: 'A network engineer is analyzing reports from a recently performed network baseline. Which situation would depict a possible latency issue?',
    answers: [
      'a change in the bandwidth according to the show interfaces output',
      'a next-hop timeout from a traceroute',
      'an increase in host-to-host ping response times',
      'a change in the amount of RAM according to the show version output'
    ],
    correctIndex: 2,
    explanation: 'Topic 17.4.1 - While analyzing historical reports an administrator can compare host-to-host timers from the ping command and depict possible latency issues.'
  },
  {
    id: 26,
    topic: 'Module 16-17',
    question: 'Which statement is true about Cisco IOS ping indicators?',
    answers: [
      '"!" indicates that the ping was unsuccessful and that the device may have issues finding a DNS server.',
      '"U" may indicate that a router along the path did not contain a route to the destination address and that the ping was unsuccessful.',
      '"." indicates that the ping was successful but the response time was longer than normal.',
      'A combination of "." and "!" indicates that a router along the path did not have a route to the destination address and responded with an ICMP unreachable message.'
    ],
    correctIndex: 1,
    explanation: 'Topic 17.4.1 - "!" = ping completed successfully. "." = connectivity/routing/security issue. "U" = router along path had no route to destination and responded with ICMP unreachable.'
  },
  {
    id: 27,
    topic: 'Module 16-17',
    question: 'A user reports a lack of network connectivity. The technician pings other computers and the default gateway — all fail. What can be determined for sure by the results of these tests?',
    answers: [
      'The NIC in the PC is bad.',
      'The TCP/IP protocol is not enabled.',
      'The router that is attached to the same network as the workstation is down.',
      'Nothing can be determined for sure at this point.'
    ],
    correctIndex: 3,
    explanation: 'Topic 17.4.1 - A failed ping could mean that the other devices on the network are blocking pings. Further investigation is warranted.'
  },
  {
    id: 28,
    topic: 'Module 16-17',
    question: 'A network technician issues the C:> tracert -6 www.cisco.com command on a Windows PC. What is the purpose of the -6 command option?',
    answers: [
      'It forces the trace to use IPv6.',
      'It limits the trace to only 6 hops.',
      'It sets a 6 milliseconds timeout for each replay.',
      'It sends 6 probes within each TTL time period.'
    ],
    correctIndex: 0,
    explanation: 'Topic 17.4.3 - The -6 option is used to force the trace to use IPv6.'
  },
  {
    id: 29,
    topic: 'Module 16-17',
    question: 'Why would a network administrator use the tracert utility?',
    answers: [
      'to determine the active TCP connections on a PC',
      'to check information about a DNS name in the DNS server',
      'to identify where a packet was lost or delayed on a network',
      'to display the IP address, default gateway, and DNS server address for a PC'
    ],
    correctIndex: 2,
    explanation: 'Topic 17.4.3 - The tracert utility is used to identify the path a packet takes from source to destination and is commonly used when packets are dropped or not reaching a specific destination.'
  },
  {
    id: 30,
    topic: 'Module 16-17',
    question: 'A ping fails from router R1 to directly connected router R2. The administrator issues the show cdp neighbors command. Why?',
    answers: [
      'The network administrator suspects a virus because the ping command did not work.',
      'The network administrator wants to verify Layer 2 connectivity.',
      'The network administrator wants to verify the IP address configured on router R2.',
      'The network administrator wants to determine if connectivity can be established from a non-directly connected network.'
    ],
    correctIndex: 1,
    explanation: 'Topic 17.5.6 - The show cdp neighbors command can be used to prove that Layer 1 and Layer 2 connectivity exists between two Cisco devices.'
  },
  {
    id: 31,
    topic: 'Module 16-17',
    question: 'A network engineer is troubleshooting connectivity issues among interconnected Cisco routers and switches. Which command should the engineer use to find the IP address information, host name, and IOS version of neighboring network devices?',
    answers: ['show version', 'show ip route', 'show interfaces', 'show cdp neighbors detail'],
    correctIndex: 3,
    explanation: 'Topic 17.5.6 - The show cdp neighbors detail command reveals IP address, capabilities, host name, and IOS version of neighboring Cisco devices.'
  },
  {
    id: 32,
    topic: 'Module 16-17',
    question: 'What information about a Cisco router can be verified using the show version command?',
    answers: [
      'the routing protocol version that is enabled',
      'the value of the configuration register',
      'the operational status of serial interfaces',
      'the administrative distance used to reach networks'
    ],
    correctIndex: 1,
    explanation: 'Topic 17.5.5 - The value of the configuration register can be verified with the show version command.'
  },
  {
    id: 33,
    topic: 'Module 16-17',
    question: 'Which command should be used on a Cisco router or switch to allow log messages to be displayed on remotely connected sessions using Telnet or SSH?',
    answers: ['debug all', 'logging synchronous', 'show running-config', 'terminal monitor'],
    correctIndex: 3,
    explanation: 'Topic 17.6.4 - The terminal monitor command is required when a user is accessing a network device remotely to see log messages.'
  },
  {
    id: 34,
    topic: 'Module 16-17',
    question: 'Which command can an administrator issue on a Cisco router to send debug messages to the vty lines?',
    answers: ['terminal monitor', 'logging console', 'logging buffered', 'logging synchronous'],
    correctIndex: 0,
    explanation: 'Topic 17.6.4 - Debug messages are sent to the console line by default. Sending these messages to the terminal lines requires the terminal monitor command.'
  },
  {
    id: 35,
    topic: 'Module 16-17',
    question: 'By following a structured troubleshooting approach, a network administrator identified a network issue after a conversation with the user. What is the next step?',
    answers: [
      'Verify full system functionality.',
      'Test the theory to determine cause.',
      'Establish a theory of probable causes.',
      'Establish a plan of action to resolve the issue.'
    ],
    correctIndex: 2,
    explanation: 'Topic 17.6.1 - After identifying the problem, the next step is to establish a theory of probable causes.'
  },
  {
    id: 36,
    topic: 'Module 16-17',
    question: 'Users cannot browse certain websites. An administrator can ping a web server via IP address but cannot browse to the domain name. Which troubleshooting tool would be most useful?',
    answers: ['netstat', 'tracert', 'nslookup', 'ipconfig'],
    correctIndex: 2,
    explanation: 'Topic 17.7.5 - The nslookup command can be used to look up information about a particular DNS name in the DNS server.'
  },
  {
    id: 37,
    topic: 'Module 16-17',
    type: 'multiselect',
    question: 'A Windows PC shows an IP address of 169.254.10.3 after running ipconfig. Which two conclusions can be drawn? (Choose two.)',
    answers: [
      'The PC cannot contact a DHCP server.',
      'The DNS server address is misconfigured.',
      'The default gateway address is not configured.',
      'The PC is configured to obtain an IP address automatically.',
      'The enterprise network is misconfigured for dynamic routing.'
    ],
    correctIndexes: [0, 3],
    correctIndex: 0,
    explanation: 'Topic 17.7.3 - A 169.254.x.x address means the PC is configured for DHCP but could not contact a DHCP server, so Windows assigned an APIPA address.'
  },
  {
    id: 38,
    topic: 'Module 16-17',
    question: 'Host H3 is having trouble communicating with host H1. The administrator wants to prove communication exists to H1 from the R2 interface that H3 uses. What tool should be used on router R2?',
    answers: ['traceroute', 'show cdp neighbors', 'Telnet', 'an extended ping'],
    correctIndex: 3,
    explanation: 'Topic 17.4.2 - An extended ping allows an administrator to specify a source address (the gigabit Ethernet port on R2) to test connectivity to H1.'
  },
  {
    id: 39,
    topic: 'Module 16-17',
    question: 'Baseline ping round trip time between H1 and H3 was 36/97/132 ms. Today it is 1458/2390/6066 ms. What does this indicate?',
    answers: [
      'Connectivity between H1 and H3 is fine.',
      'H3 is not connected properly to the network.',
      'Something is causing interference between H1 and R1.',
      'Performance between the networks is within expected parameters.',
      'Something is causing a time delay between the networks.'
    ],
    correctIndex: 4,
    explanation: 'Topic 17.4.5 - The significantly higher round trip times compared to the baseline indicate something is causing a time delay between the networks.'
  },
  {
    id: 40,
    topic: 'Module 16-17',
    question: 'Which network service automatically assigns IP addresses to devices on the network?',
    answers: ['DHCP', 'Telnet', 'DNS', 'traceroute'],
    correctIndex: 0,
    explanation: 'Topic 17.2.2 - Dynamic Host Configuration Protocol (DHCP) allows end devices to automatically configure IP information such as IP address, subnet mask, DNS server, and default gateway.'
  },
  {
    id: 41,
    topic: 'Module 16-17',
    question: 'Which command can an administrator execute to determine what interface a router will use to reach remote networks?',
    answers: ['show arp', 'show interfaces', 'show ip route', 'show protocols'],
    correctIndex: 2,
    explanation: 'Topic 17.5.5 - The show ip route command displays the IP routing table showing known local and remote networks and the interfaces used to reach them.'
  },
  {
    id: 42,
    topic: 'Module 16-17',
    type: 'multiselect',
    question: 'On which two interfaces or ports can security be improved by configuring executive timeouts? (Choose two.)',
    answers: ['Fast Ethernet interfaces', 'console ports', 'serial interfaces', 'vty ports', 'loopback interfaces'],
    correctIndexes: [1, 3],
    correctIndex: 1,
    explanation: 'Topic 16.4.3 - Executive timeouts allow the Cisco device to automatically disconnect users after they have been idle. Console, vty, and aux ports can be configured with executive timeouts.'
  },
  {
    id: 43,
    topic: 'Module 16-17',
    type: 'multiselect',
    question: 'When configuring SSH on a router, a network engineer has issued the login local and transport input ssh commands. What three additional actions are needed? (Choose three.)',
    answers: [
      'Set the user privilege levels.',
      'Generate the asymmetric RSA keys.',
      'Configure the correct IP domain name.',
      'Configure role-based CLI access.',
      'Create a valid local username and password database.',
      'Manually enable SSH after the RSA keys are generated.'
    ],
    correctIndexes: [1, 2, 4],
    correctIndex: 1,
    explanation: 'Topic 16.4.4 - SSH is automatically enabled after the RSA keys are generated. The three required steps are: generate RSA keys, configure IP domain name, and create a local username/password database.'
  },
  {
    id: 44,
    topic: 'Module 16-17',
    question: 'What is considered the most effective way to mitigate a worm attack?',
    answers: [
      'Change system passwords every 30 days.',
      'Ensure that all systems have the most current virus definitions.',
      'Ensure that AAA is configured in the network.',
      'Download security updates from the operating system vendor and patch all vulnerable systems.'
    ],
    correctIndex: 3,
    explanation: 'Topic 16.3.3 - Because worms take advantage of vulnerabilities in the system itself, the most effective way to mitigate worm attacks is to download security updates and patch all vulnerable systems.'
  },
  {
    id: 45,
    topic: 'Module 16-17',
    question: 'Which statement describes the ping and tracert commands?',
    answers: [
      'Tracert shows each hop, while ping shows a destination reply only.',
      'Tracert uses IP addresses; ping does not.',
      'Both ping and tracert can show results in a graphical display.',
      'Ping shows whether the transmission is successful; tracert does not.'
    ],
    correctIndex: 0,
    explanation: 'Topic 17.4.1 - Tracert traces the route a message takes and displays each hop along the way, while ping only tests end-to-end connectivity.'
  },
  {
    id: 46,
    topic: 'Module 16-17',
    question: 'A technician is to document the current configurations of all network devices in a college, including those in off-site buildings. Which protocol would be best to use to securely access the network devices?',
    answers: ['FTP', 'HTTP', 'SSH', 'Telnet'],
    correctIndex: 2,
    explanation: 'Topic 16.4.4 - Telnet sends passwords and other information in clear text, while SSH encrypts its data. FTP and HTTP do not provide remote device access for configuration purposes.'
  },
  {
    id: 47,
    topic: 'Module 16-17',
    question: 'Which command has to be configured on the router to complete the SSH configuration? (PT Activity)',
    answers: [
      'service password-encryption',
      'transport input ssh',
      'enable secret class',
      'ip domain-name cisco.com'
    ],
    correctIndex: 1,
    explanation: 'Topic 16.4.4 - The missing command to complete the SSH configuration is transport input ssh in line vty 0 4 mode.'
  },
  {
    id: 48,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "WhatAreyouwaiting4" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is strong because it uses a passphrase.',
      'It is weak because it is often the default password on new devices.',
      'It is weak since it uses easily found personal information.',
      'It is weak since it is a word that is easily found in the dictionary.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.2 - A passphrase is a strong password type.'
  },
  {
    id: 49,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "pR3s!d7n&0" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.',
      'It is weak because it is often the default password on new devices.',
      'It is weak since it uses easily found personal information.',
      'It is weak since it is a word that is easily found in the dictionary.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.2 - This password is strong because it uses a minimum of 10 numbers, letters and special characters.'
  },
  {
    id: 50,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "5$7*4#033!" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is strong because it contains 10 numbers and special characters.',
      'It is weak because it is often the default password on new devices.',
      'It is weak since it uses easily found personal information.',
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.2 - This password is strong because it contains 10 numbers and special characters.'
  },
  {
    id: 51,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "pR3s!d7n&0" as the password. Which statement applies? (variant)',
    answers: [
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.',
      'It is weak since it is a word that is easily found in the dictionary.',
      'It is strong because it uses a passphrase.',
      'It is strong because it contains 10 numbers and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.2 - This password is strong because it uses a minimum of 10 numbers, letters and special characters.'
  },
  {
    id: 52,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "12345678!" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is weak because it uses a series of numbers or letters.',
      'It is strong because it uses a passphrase.',
      'It is weak since it is a word that is easily found in the dictionary.',
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.1 - This password is weak because it uses a series of numbers.'
  },
  {
    id: 53,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "admin" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is weak because it is often the default password on new devices.',
      'It is strong because it uses a passphrase.',
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.',
      'It is strong because it contains 10 numbers and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.1 - "admin" is weak because it is often the default password on new devices.'
  },
  {
    id: 54,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "Feb121978" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is weak because it uses easily found personal information.',
      'It is strong because it uses a passphrase.',
      'It is weak since it is a word that is easily found in the dictionary.',
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.2 - This password is weak because it uses easily found personal information (a date of birth).'
  },
  {
    id: 55,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "password" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is weak because it is a commonly used password.',
      'It is weak since it is a word that is easily found in the dictionary.',
      'It is strong because it uses a passphrase.',
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.1 - "password" is weak because it is a commonly used password.'
  },
  {
    id: 56,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "RobErT" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is weak since it uses easily found personal information.',
      'It is strong because it uses a passphrase.',
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.',
      'It is strong because it contains 10 numbers and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.2 - This password is weak since it uses easily found personal information (a name).'
  },
  {
    id: 57,
    topic: 'Module 16-17',
    question: 'An administrator decides to use "Elizabeth" as the password on a newly installed router. Which statement applies?',
    answers: [
      'It is weak because it uses easily found personal information.',
      'It is strong because it uses a passphrase.',
      'It is weak since it is a word that is easily found in the dictionary.',
      'It is strong because it uses a minimum of 10 numbers, letters and special characters.'
    ],
    correctIndex: 0,
    explanation: 'Topic 16.4.2 - This password is weak because it uses easily found personal information (a name). Strong passwords should avoid names of children, relatives, pets, birthdays, or any easily identifiable personal information.'
  },
  {
    id: 58,
    topic: 'Module 16-17',
    question: 'A network technician needs to verify the IP addresses of all interfaces on a router. What is the best command to use?',
    answers: ['show ip interface brief', 'nslookup', 'ipconfig getifaddr en0', 'show ip route'],
    correctIndex: 0,
    explanation: 'Topic 17.5.7 - The show ip interface brief command displays a summary of all interfaces and their IP addresses.'
  },
  {
    id: 59,
    topic: 'Module 16-17',
    question: 'Students connected to the same switch are having slower than normal response times. The administrator suspects a duplex setting issue. What is the best command to use?',
    answers: ['show interfaces', 'ipconfig getifaddr en0', 'copy running-config startup-config', 'show ip nat translations'],
    correctIndex: 0,
    explanation: 'Topic 17.7.1 - The show interfaces command displays duplex and speed settings for interfaces.'
  },
  {
    id: 60,
    topic: 'Module 16-17',
    question: 'A user wants to know the IP address of the PC. What is the best command to use?',
    answers: ['ipconfig', 'copy running-config startup-config', 'show interfaces', 'show ip nat translations'],
    correctIndex: 0,
    explanation: 'Topic 17.5.1 - The ipconfig command displays the IP address configuration of a Windows PC.'
  },
  {
    id: 61,
    topic: 'Module 16-17',
    question: 'A student wants to save a router configuration to NVRAM. What is the best command to use?',
    answers: ['copy running-config startup-config', 'show interfaces', 'show ip nat translations', 'show ip route'],
    correctIndex: 0,
    explanation: 'Topic 17.5.1 - The copy running-config startup-config command saves the current configuration to NVRAM.'
  },
  {
    id: 62,
    topic: 'Module 16-17',
    question: 'A support technician needs to know the IP address of the wireless interface on a MAC. What is the best command to use?',
    answers: ['ipconfig getifaddr en0', 'copy running-config startup-config', 'show interfaces', 'show ip nat translations'],
    correctIndex: 0,
    explanation: 'Topic 17.5.3 - The ipconfig getifaddr en0 command displays the IP address of the wireless interface on a Mac.'
  },
  {
    id: 63,
    topic: 'Module 16-17',
    question: 'A network technician needs to verify all of the IPv6 interface addresses on a router. What is the best command to use?',
    answers: ['show ipv6 interface', 'show interfaces', 'show ip nat translations', 'show ip route'],
    correctIndex: 0,
    explanation: 'Topic 17.5.5 - The show ipv6 interface command displays all IPv6 interface addresses on a router.'
  },
  {
    id: 64,
    topic: 'Module 16-17',
    question: 'A teacher needs to verify that a default gateway is configured correctly on his PC. What is the best command to use?',
    answers: ['ipconfig', 'copy running-config startup-config', 'show interfaces', 'show ip nat translations'],
    correctIndex: 0,
    explanation: 'Topic 17.5.1 - The ipconfig command displays the default gateway along with IP address and subnet mask on a Windows PC.'
  },
  {
    id: 65,
    topic: 'Module 16-17',
    question: 'Only employees connected to IPv6 interfaces are having difficulty connecting to remote networks. The analyst wants to verify that IPv6 routing has been enabled. What is the best command to use?',
    answers: ['show running-config', 'show interfaces', 'copy running-config startup-config', 'show ip nat translations'],
    correctIndex: 0,
    explanation: 'Topic 17.7.2 - The show running-config command can be used to verify that IPv6 unicast routing has been enabled with the ipv6 unicast-routing command.'
  },
  {
    id: 66,
    topic: 'Module 16-17',
    question: 'An administrator is troubleshooting connectivity issues and needs to determine the IP address of a website. What is the best command to use?',
    answers: ['nslookup', 'show ipv6 route', 'show ipv6 interface', 'copy startup-config running-config'],
    correctIndex: 0,
    explanation: 'Topic 17.7.5 - The nslookup command queries the DNS server to resolve a domain name to an IP address.'
  },
  {
    id: 67,
    topic: 'Module 16-17',
    question: 'What is a characteristic of UDP?',
    answers: [
      'UDP datagrams take the same path and arrive in the correct order at the destination.',
      'Applications that use UDP are always considered unreliable.',
      'UDP reassembles the received datagrams in the order they were received.',
      'UDP only passes data to the network when the destination is ready to receive the data.'
    ],
    correctIndex: 2,
    explanation: 'Topic 17.8 - UDP has no way to reorder the datagrams into their transmission order, so UDP simply reassembles the data in the order it was received and forwards it to the application.'
  }
];
