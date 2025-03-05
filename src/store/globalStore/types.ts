export interface GlobalState {
    loading: boolean;
}

export interface GlobalStateAction {
    setLoading: (loading: boolean) => void; 
}
