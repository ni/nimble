import { NimbleBreadcrumb } from '@ni/nimble-react/breadcrumb';
import { NimbleBreadcrumbItem } from '@ni/nimble-react/breadcrumb-item';
import { SubContainer } from './SubContainer';

export function BreadcrumbSection(): React.JSX.Element {
    return (
        <SubContainer label="Breadcrumb">
            <NimbleBreadcrumb>
                <NimbleBreadcrumbItem href="#">Page 1</NimbleBreadcrumbItem>
                <NimbleBreadcrumbItem
                    href="#"
                >Page 2</NimbleBreadcrumbItem>
                <NimbleBreadcrumbItem>Current Page (No Link)</NimbleBreadcrumbItem>
            </NimbleBreadcrumb>
        </SubContainer>
    );
}
