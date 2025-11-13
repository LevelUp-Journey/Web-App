import { SearchIcon } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";

interface SearchInputProps {
    placeholder?: string;
}

export function SearchInput({
    placeholder = "Search something...",
}: SearchInputProps) {
    return (
        <div className="max-w-lg w-full inline">
            <div className="relative">
                <InputGroup>
                    <InputGroupInput placeholder={placeholder} />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    );
}
