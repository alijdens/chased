/**
 * Attaches human control to an entity.
 * 
 * @param entity Entity to control.
 */
function human_control_component_add(entity) {
    // this component has no associated data
    // just the fact that this component is attached to an entity works 
    entity_manager_add_component(entity, COMPONENT.HUMAN_CONTROL, {});
}
