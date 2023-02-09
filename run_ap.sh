#sudo dhcpcd wlan0
sudo dhcpcd ap0
cd Server
lxterminal --command "sudo node server.js"
sleep 2
lxterminal --command "chromium-browser http://192.168.249.1:80/visualizer --kiosk"
