export default function getPaths(uuid) {
  return {
    logs: `screens/${uuid}`,
    feature: `features/${uuid}`,
    info_location: `infos/${uuid}/location`,
    info_userAgent: `infos/${uuid}/userAgent`,
    info_device: `infos/${uuid}/device`,
    networks_resources: `networks/${uuid}/resources`,
    network_requests: `networks/${uuid}/requests`,
    commands: `commands/${uuid}`,
    commands_request: `commands/${uuid}/command`,
    configs: `configs/${uuid}`,
    element: `element/${uuid}/select`,
    element_select_to: `element/${uuid}/selectTo`,
    element_style_to: `element/${uuid}/styleTo`,
  };
}
