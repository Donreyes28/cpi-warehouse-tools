import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './Breadcrumb.css'

const NavBreadcrumb = (props) => {
    const breadcrumbClass = props.isOpen
      ? "nav-breadcrumb open"
      : "nav-breadcrumb"; 

  return (
    <Breadcrumb className={breadcrumbClass}>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="">
        Library
      </Breadcrumb.Item>
      <Breadcrumb.Item active>Data</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default NavBreadcrumb;