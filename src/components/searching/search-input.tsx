import { SearchIcon } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "../ui/input-group";

export function SearchInput() {
    return (
        <div className="max-w-md w-full">
            <div className="relative">
                <InputGroup>
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton>Search</InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    );
}
