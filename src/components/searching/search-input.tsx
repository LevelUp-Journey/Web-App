import { SearchIcon } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "../ui/input-group";

export function SearchInput() {
    return (
        <div className="max-w-lg w-full inline">
            <div className="relative">
                <InputGroup>
                    <InputGroupInput placeholder="Search something..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    );
}
