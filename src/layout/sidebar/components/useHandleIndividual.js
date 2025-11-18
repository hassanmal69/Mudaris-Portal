import { newDirect } from "@/redux/features/channels/directSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const useHandleIndividual = () => {

    const session = useSelector((state) => state.auth);
    const { workspace_id } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleFunction = (u) => {
        console.log('us is', u)
        const token = u?.id.slice(0, 6) + `${session?.user?.id.slice(0, 6)}`;
        navigate(`/workspace/${workspace_id}/individual/${token}`);
        dispatch(newDirect(u));
    }
    return handleFunction

};
export default useHandleIndividual;