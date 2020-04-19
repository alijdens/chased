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

    for( var component_name in COMPONENT ) {
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
    for( var i = 0; i < _entity_map[entity].length; i++ ) {
        const component = _entity_map[entity][i];
        delete _component_map[component][entity];
    }

    delete _entity_map[entity];
}

/**
 * Adds a component to an entity.
 *
 * @param entity Entity to which the component will be linked to.
 * @param component_name Name of the component to link.
 * @param component Component data to link.
 */
function entity_manager_add_component(entity, component_name, component) {
    if( entity in _component_map[component_name] ) {
        throw new Error("Attempted to register the component '" + component_name + "' twice in entity " + entity);
    }

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
    if( index > -1 ) {
        _entity_map[entity].splice( index, 1 );
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
    if( !( entity in _component_map[component_name] ) ) {
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
    return ( entity in _component_map[component_name] );
}

/**
 * Returns all entities that have the corresponding component attached.
 *
 * @param component_name Name of the component. 
 */
function entity_manager_get_with_component(component_name) {
    return _component_map[component_name];
}
