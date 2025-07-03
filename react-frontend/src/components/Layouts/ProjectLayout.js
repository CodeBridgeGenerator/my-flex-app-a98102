import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import CustomersPage from "../CustomersPage/CustomersPage";
import VehiclesPage from "../VehiclesPage/VehiclesPage";
import LoyaltyprogramsPage from "../LoyaltyprogramsPage/LoyaltyprogramsPage";
import InvoicesPage from "../InvoicesPage/InvoicesPage";
import ServicesPage from "../ServicesPage/ServicesPage";
import ServicerecordsPage from "../ServicerecordsPage/ServicerecordsPage";
import MaintenanceschedulesPage from "../MaintenanceschedulesPage/MaintenanceschedulesPage";
import OilchangerecordsPage from "../OilchangerecordsPage/OilchangerecordsPage";
import TechniciansPage from "../TechniciansPage/TechniciansPage";
import PartsinventoryPage from "../PartsinventoryPage/PartsinventoryPage";
import SuppliersPage from "../SuppliersPage/SuppliersPage";
import PaymentmethodsPage from "../PaymentmethodsPage/PaymentmethodsPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "customers":
                return <CustomersPage />;
case "vehicles":
                return <VehiclesPage />;
case "loyaltyprograms":
                return <LoyaltyprogramsPage />;
case "invoices":
                return <InvoicesPage />;
case "services":
                return <ServicesPage />;
case "servicerecords":
                return <ServicerecordsPage />;
case "maintenanceschedules":
                return <MaintenanceschedulesPage />;
case "oilchangerecords":
                return <OilchangerecordsPage />;
case "technicians":
                return <TechniciansPage />;
case "partsinventory":
                return <PartsinventoryPage />;
case "suppliers":
                return <SuppliersPage />;
case "paymentmethods":
                return <PaymentmethodsPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;
