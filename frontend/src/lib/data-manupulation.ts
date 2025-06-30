type WithId = {
    id: number;
    [key: string]: any;
};

// Filter objects and set state
export function filterObjects<T extends WithId>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    predicate: (item: T) => boolean
): void {
    setState(prev => prev.filter(predicate));
}

// Delete object by id and set state
export function deleteObjectById<T extends WithId>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    id: number
): void {
    setState(prev => prev.filter(item => item.id !== id));
}

// Update object by id and set state
export function updateObjectById<T extends WithId>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    id: number,
    updateFn: (item: T) => T
): void {
    setState(prev => prev.map(item => (item.id === id ? updateFn(item) : item)));
}

// Add object to start or end and set state
export function addObject<T extends WithId>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    newObject: T,
    position: "start" | "end" = "start"
): void {
    setState(prev =>
        position === "start" ? [newObject, ...prev] : [...prev, newObject]
    );
}
