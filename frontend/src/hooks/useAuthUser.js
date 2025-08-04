import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api.js';

const useAuthUser = () =>{
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false, //auth checks don't need retries
        onError: (error) => {
            console.log("Auth check failed:", error);
        }
    });
    
    // Return null for authUser if there's an error or no data
    const user = authUser.error ? null : authUser.data?.user;
    
    return { 
        isLoading: authUser.isLoading, 
        authUser: user 
    };

}
export default useAuthUser;
