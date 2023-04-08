/**
 * Module initializer.
 */
function entity_manager_init() {
    // the last allocated ID. (initialized to -1 so the first entity has ID 0)
    _last_id = -1;

    // maps components to the entities that have them attached.
    _component_map = {};

    // maps an entity to its components.
    _entity_map = {};

    for (var component_name in COMPONENT) {
        _component_map[COMPONENT[component_name]] = {};
    }
}

/**
 * creates a new entity by allocating and returning a new ID.
 */
function entity_manager_create_entity() {
    _last_id += 1;
    _entity_map[_last_id] = [];
    return _last_id;
}

/**
 * Destroys an entity.
 * 
 * @param entity Entity ti destroy.
 */
function entity_manager_destroy_entity(entity) {
    // removes from all associated components
    for (var i = 0; i < _entity_map[entity].length; i++) {
        const component = _entity_map[entity][i];
        delete _component_map[component][entity];
    }

    delete _entity_map[entity];
}

/**
 * Adds a component to an entity. If the component is already registered,
 * throws an error.
 *
 * @param entity Entity to which the component will be linked to.
 * @param component_name Name of the component to link.
 * @param component Component data to link.
 */
function entity_manager_add_component(entity, component_name, component) {
    if (entity in _component_map[component_name]) {
        throw new Error("Attempted to register the component '" + component_name + "' twice in entity " + entity);
    }

    entity_manager_update_component(entity, component_name, component);
}

/**
 * Updates/adds a component attached to an entity.
 *
 * @param entity Entity to which the component will be linked to.
 * @param component_name Name of the component to link.
 * @param component Component data to link.
 */
function entity_manager_update_component(entity, component_name, component) {
    _component_map[component_name][entity] = component;
    _entity_map[entity].push(component_name);
}

/**
 * Removes a component from an entity.
 * 
 * @param entity Target entity.
 * @param component_name Name of the component to remove.
 */
function entity_manager_remove_component(entity, component_name) {
    delete _component_map[component_name][entity];

    const index = _entity_map[entity].indexOf(component_name);
    if (index > -1) {
        _entity_map[entity].splice(index, 1);
    }
}

/**
 * Gets the requested component's data associated to the entity or undefined if
 * the entity has no such component registered.
 * 
 * @param entity Entity to query.
 * @param component_name Name of the component to get.
 */
function entity_manager_get_component(entity, component_name) {
    if (!(entity in _component_map[component_name])) {
        return undefined;
    }

    return _component_map[component_name][entity];
}

/**
 * Checks if an entity has attached a particular component.
 * 
 * @param entity Entity to query.
 * @param component_name Name of the component.
 */
function entity_manager_has_component(entity, component_name) {
    return (entity in _component_map[component_name]);
}

/**
 * Returns all entities that have the corresponding component attached.
 *
 * @param component_name Name of the component. 
 */
function entity_manager_get_with_component(component_name) {
    return _component_map[component_name];
}

/**
 * Returns the current state of the entity manager so it can be
 * restored later.
 */
function entity_manager_get_current_state() {
    let state = {
        last_id: _last_id,
        component_map: _component_map,
        entity_map: _entity_map,
    };

    // JSON dump the complex object in order to create deep copies
    // and not get any reference to the original ones
    return JSON.stringify(state);
}

/**
 * Restores the entity manager to the given state. The given state
 * must be an object returned by `entity_manager_get_current_state`.
 */
function entity_manager_restore_state(new_state) {
    let state = JSON.parse(new_state);

    // FIXME: this is a hack to restore the vector classes. It could be
    //        implemented better by adding a `serialize` and `deserialize`
    //        methods to the components to handle this properly.
    // update the components that contain vectors to have actual instances
    // of the vector class instead of plain objects that were simplified by
    // the serialization/deserialization process.
    for (var entity in state.component_map[COMPONENT.PHYSICS]) {
        const comp = state.component_map[COMPONENT.PHYSICS][entity];
        comp.speed = new Vector2(comp.speed.x, comp.speed.y);
        comp.pos = new Vector2(comp.pos.x, comp.pos.y);
    }

    for (var entity in state.component_map[COMPONENT.ROBOT_MOVE]) {
        const comp = state.component_map[COMPONENT.ROBOT_MOVE][entity];
        comp.tgt_pos = new Vector2(comp.tgt_pos.x, comp.tgt_pos.y);
    }

    _last_id = state.last_id;
    _component_map = state.component_map;
    _entity_map = state.entity_map;
}