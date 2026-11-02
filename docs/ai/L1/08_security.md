# 08 Security

Next.js owns token signing and Agent lifecycle credentials. Keep the App Certificate and any optional provider keys server-only. Never log, commit or screenshot secrets.

This first version has no business records or data APIs. User speech and transcripts still pass through the configured Agora/model services; this source does not define their retention policies. Do not collect unnecessary identifying, payment or account information.

Public demo access, abuse limits and spending controls need deployment-specific configuration. The sample token/start/stop endpoints are not production login. Report vulnerabilities privately to security@agora.io.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
