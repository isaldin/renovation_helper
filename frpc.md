## FRPC
### Used for tunneling local servers to the internet
`frpc -c ~/.frp/frpc.toml`

### Configuration file example:
```toml
[common]
server_addr = "vps-ip"
server_port = 7000
token  = "your-token"

[web]
type           = "http"
local_port     = 4200
local_ip       = "127.0.0.1"
custom_domains = some.domain.com

[back]
type           = "http"
local_port     = 3000
local_ip       = "127.0.0.1"
custom_domains = api.some.domain.com
```

Check that in Nginx Proxy Manager redirection to right local server IP.