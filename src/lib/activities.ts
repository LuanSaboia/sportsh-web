import supabase from './supabase';

export const POINT_VALUES = {
    physical: 50,
    spiritual: 30,
    evangelization: 100
};

export const registerActivity = async (type: 'physical' | 'spiritual' | 'evangelization', description: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Usuário não autenticado");

    const points = POINT_VALUES[type];

    const { error } = await supabase.rpc('handle_activity', {
        p_user_id: user.id,
        p_type: type,
        p_description: description,
        p_points: points
    });

    if (error) throw error;
    return true;
};