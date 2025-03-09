"use client"

import {ActionIcon, Affix, Popover, PopoverDropdown, PopoverTarget, TableOfContents, Text, Title} from "@mantine/core";
import { IconList } from '@tabler/icons-react';

export default function TOC()  {
    return (
        <Affix position={{bottom:20,right:20}}>
            <Popover width={200} position="bottom" withArrow shadow="md">
                <PopoverTarget>
                    <ActionIcon variant="filled" aria-label="Table of Contents">
                        <IconList style={{ width: '75%', height: '75%' }} stroke={1.5} />
                    </ActionIcon>
                </PopoverTarget>
                <PopoverDropdown>
                    <Text size="sm" fw={700}>Table of Contents</Text>
                    <TableOfContents
                        variant="filled"
                        color="blue"
                        size="sm"
                        radius="sm"
                        minDepthToOffset={0}
                        depthOffset={40}
                        scrollSpyOptions={{
                            selector: 'h1, h2, h3, h4, h5, h6',
                        }}
                        getControlProps={({ data }) => ({
                            onClick: () => {
                                // data.getNode().scrollIntoView(false)
                                data.getNode().scrollIntoView({block:"center"})
                            },
                            children: data.value,
                        })}
                    />
                </PopoverDropdown>
            </Popover>
        </Affix>
    );
};


