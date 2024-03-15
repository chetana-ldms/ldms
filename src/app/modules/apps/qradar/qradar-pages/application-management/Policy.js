import { useNavigate } from "react-router-dom";

function Policy() {
    const activeTab = sessionStorage.getItem("activeTab");
    const navigate = useNavigate();

    const goToRiskPage = () => {
        navigate("/qradar/application/list");
    };

    const goToInventoryPage = () => {
        navigate("/qradar/application/inventory");
        const activeTab = sessionStorage.getItem("activeTab");
        if (activeTab === "inventory") {
            sessionStorage.removeItem("activeTab");
        }
    };

    return (
        <div className="">
            {activeTab == "policy" ? null : (
                <>
                    <div className="">
                        <h1>Application Management</h1>
                    </div>
                    <div className="d-flex">
                        <div className="button btn btn-primary text-bg-light" onClick={goToRiskPage}>
                            Risk
                        </div>
                        <div className="button btn btn-primary text-bg-light" onClick={goToInventoryPage}>
                            Inventory
                        </div>
                        <div className="button btn btn-primary text-bg-light">
                            Policy
                        </div>
                    </div>
                </>
            )}
            <div>
                <p>Policy</p>
            </div>
        </div>
    );
}

export default Policy;
