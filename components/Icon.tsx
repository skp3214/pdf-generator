import Image from 'next/image';

interface IconProps {
    name: 'user' | 'mail' | 'phone' | 'Description' | 'position' | 'Download' | 'view' | 'chevron-left';
    className?: string;
    useFile?: boolean; 
}

export const Icon = ({ name, className = '', useFile = false }: IconProps) => {
    if (useFile) {
        return (
            <Image
                src={`/icons/${name}.svg`}
                alt={`${name} icon`}
                width={20}
                height={20}
                className={className}
            />
        );
    }
    return null;
};
