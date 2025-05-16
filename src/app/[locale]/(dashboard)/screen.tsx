"use client"

import { Title } from "@/components/Title"
import { Box, Flex, Span } from "@chakra-ui/react"

const articleList = [
  {
    image: "https://placehold.co/600x400",
    label:
      "Neque porro quisquam est qui doloremorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut niorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut ni",
    description:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut nibh et diam viverra consectetur id ac erat. Nullam a dui mattis, lacinia orci quis, molestie arcu. Maecenas facilisis lacinia risus, non condimentum mi gravida et. Phasellus eros tellus, pulvinar a ante et, imperdiet fringilla felis. In eget vestibulum urna. Fusce id hendrerit magna. Phasellus nunc ex, tincidunt in nunc sed, pretium tempor mauris. Curabitur id odio quis velit dictum ultrices. Fusce sagittis quis tortor et posuere. Cras volutpat ex posuere sollicitudin venenatis. Phasellus lorem magna, porttitor eget pulvinar sit amet, mattis non tortor. Nam in mauris rhoncus magna congue maximus. In hac habitasse platea dictumst. Nam id tristique purus. Curabitur vestibulum gravida venenatis. Maecenas laoreet enim diam, vitae egestas neque rutrum rutrum. Cras semper congue dolor, ornare pretium orci. Aliquam tincidunt purus sed felis placerat volutpat. Donec aliquet dictum lacus. Etiam id augue in odio mollis sodales quis ac elit. Proin neque nisi, convallis in elit ac, eleifend rhoncus metus. Aliquam velit dui, egestas sed justo faucibus, pellentesque tristique purus. Vestibulum in commodo ante. Curabitur nec lectus nunc. Maecenas lobortis diam eget orci dictum vehicula. Ut rhoncus risus non orci dignissim, quis euismod enim placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque molestie mauris vitae nunc ullamcorper, eu efficitur augue elementum.",
  },
  {
    image: "https://placehold.co/500x400",
    label:
      "Neque porro quisquam est qui doloremNeque porro quisquam est qui doloremorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consecteturNeque porro quisquam est qui doloremorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur",
    description:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut nibh et diam viverra consectetur id ac erat. Nullam a dui mattis, lacinia orci quis, molestie arcu. Maecenas facilisis lacinia risus, non condimentum mi gravida et. Phasellus eros tellus, pulvinar a ante et, imperdiet fringilla felis. In eget vestibulum urna. Fusce id hendrerit magna. Phasellus nunc ex, tincidunt in nunc sed, pretium tempor mauris. Curabitur id odio quis velit dictum ultrices. Fusce sagittis quis tortor et posuere. Cras volutpat ex posuere sollicitudin venenatis. Phasellus lorem magna, porttitor eget pulvinar sit amet, mattis non tortor. Nam in mauris rhoncus magna congue maximus. In hac habitasse platea dictumst. Nam id tristique purus. Curabitur vestibulum gravida venenatis. Maecenas laoreet enim diam, vitae egestas neque rutrum rutrum. Cras semper congue dolor, ornare pretium orci. Aliquam tincidunt purus sed felis placerat volutpat. Donec aliquet dictum lacus. Etiam id augue in odio mollis sodales quis ac elit. Proin neque nisi, convallis in elit ac, eleifend rhoncus metus. Aliquam velit dui, egestas sed justo faucibus, pellentesque tristique purus. Vestibulum in commodo ante. Curabitur nec lectus nunc. Maecenas lobortis diam eget orci dictum vehicula. Ut rhoncus risus non orci dignissim, quis euismod enim placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque molestie mauris vitae nunc ullamcorper, eu efficitur augue elementum.",
  },
  {
    image: "https://placehold.co/400x400",
    label: "Neque porro quisquam est qui dolorem",
    description:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut nibh et diam viverra consectetur id ac erat. Nullam a dui mattis, lacinia orci quis, molestie arcu. Maecenas facilisis lacinia risus, non condimentum mi gravida et. Phasellus eros tellus, pulvinar a ante et, imperdiet fringilla felis. In eget vestibulum urna. Fusce id hendrerit magna. Phasellus nunc ex, tincidunt in nunc sed, pretium tempor mauris. Curabitur id odio quis velit dictum ultrices. Fusce sagittis quis tortor et posuere. Cras volutpat ex posuere sollicitudin venenatis. Phasellus lorem magna, porttitor eget pulvinar sit amet, mattis non tortor. Nam in mauris rhoncus magna congue maximus. In hac habitasse platea dictumst. Nam id tristique purus. Curabitur vestibulum gravida venenatis. Maecenas laoreet enim diam, vitae egestas neque rutrum rutrum. Cras semper congue dolor, ornare pretium orci. Aliquam tincidunt purus sed felis placerat volutpat. Donec aliquet dictum lacus. Etiam id augue in odio mollis sodales quis ac elit. Proin neque nisi, convallis in elit ac, eleifend rhoncus metus. Aliquam velit dui, egestas sed justo faucibus, pellentesque tristique purus. Vestibulum in commodo ante. Curabitur nec lectus nunc. Maecenas lobortis diam eget orci dictum vehicula. Ut rhoncus risus non orci dignissim, quis euismod enim placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque molestie mauris vitae nunc ullamcorper, eu efficitur augue elementum.",
  },
  {
    image: "https://placehold.co/600x450",
    label: "Neque porro quisquam est qui dolorem",
    description:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut nibh et diam viverra consectetur id ac erat. Nullam a dui mattis, lacinia orci quis, molestie arcu. Maecenas facilisis lacinia risus, non condimentum mi gravida et. Phasellus eros tellus, pulvinar a ante et, imperdiet fringilla felis. In eget vestibulum urna. Fusce id hendrerit magna. Phasellus nunc ex, tincidunt in nunc sed, pretium tempor mauris. Curabitur id odio quis velit dictum ultrices. Fusce sagittis quis tortor et posuere. Cras volutpat ex posuere sollicitudin venenatis. Phasellus lorem magna, porttitor eget pulvinar sit amet, mattis non tortor. Nam in mauris rhoncus magna congue maximus. In hac habitasse platea dictumst. Nam id tristique purus. Curabitur vestibulum gravida venenatis. Maecenas laoreet enim diam, vitae egestas neque rutrum rutrum. Cras semper congue dolor, ornare pretium orci. Aliquam tincidunt purus sed felis placerat volutpat. Donec aliquet dictum lacus. Etiam id augue in odio mollis sodales quis ac elit. Proin neque nisi, convallis in elit ac, eleifend rhoncus metus. Aliquam velit dui, egestas sed justo faucibus, pellentesque tristique purus. Vestibulum in commodo ante. Curabitur nec lectus nunc. Maecenas lobortis diam eget orci dictum vehicula. Ut rhoncus risus non orci dignissim, quis euismod enim placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque molestie mauris vitae nunc ullamcorper, eu efficitur augue elementum.",
  },
  {
    image: "https://placehold.co/600x600",
    label: "Neque porro quisquam est qui dolorem",
    description:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut nibh et diam viverra consectetur id ac erat. Nullam a dui mattis, lacinia orci quis, molestie arcu. Maecenas facilisis lacinia risus, non condimentum mi gravida et. Phasellus eros tellus, pulvinar a ante et, imperdiet fringilla felis. In eget vestibulum urna. Fusce id hendrerit magna. Phasellus nunc ex, tincidunt in nunc sed, pretium tempor mauris. Curabitur id odio quis velit dictum ultrices. Fusce sagittis quis tortor et posuere. Cras volutpat ex posuere sollicitudin venenatis. Phasellus lorem magna, porttitor eget pulvinar sit amet, mattis non tortor. Nam in mauris rhoncus magna congue maximus. In hac habitasse platea dictumst. Nam id tristique purus. Curabitur vestibulum gravida venenatis. Maecenas laoreet enim diam, vitae egestas neque rutrum rutrum. Cras semper congue dolor, ornare pretium orci. Aliquam tincidunt purus sed felis placerat volutpat. Donec aliquet dictum lacus. Etiam id augue in odio mollis sodales quis ac elit. Proin neque nisi, convallis in elit ac, eleifend rhoncus metus. Aliquam velit dui, egestas sed justo faucibus, pellentesque tristique purus. Vestibulum in commodo ante. Curabitur nec lectus nunc. Maecenas lobortis diam eget orci dictum vehicula. Ut rhoncus risus non orci dignissim, quis euismod enim placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque molestie mauris vitae nunc ullamcorper, eu efficitur augue elementum.",
  },
  {
    image: "https://placehold.co/600x200",
    label: "Neque porro quisquam est qui dolorem",
    description:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consectetur varius diam. Quisque ut nibh et diam viverra consectetur id ac erat. Nullam a dui mattis, lacinia orci quis, molestie arcu. Maecenas facilisis lacinia risus, non condimentum mi gravida et. Phasellus eros tellus, pulvinar a ante et, imperdiet fringilla felis. In eget vestibulum urna. Fusce id hendrerit magna. Phasellus nunc ex, tincidunt in nunc sed, pretium tempor mauris. Curabitur id odio quis velit dictum ultrices. Fusce sagittis quis tortor et posuere. Cras volutpat ex posuere sollicitudin venenatis. Phasellus lorem magna, porttitor eget pulvinar sit amet, mattis non tortor. Nam in mauris rhoncus magna congue maximus. In hac habitasse platea dictumst. Nam id tristique purus. Curabitur vestibulum gravida venenatis. Maecenas laoreet enim diam, vitae egestas neque rutrum rutrum. Cras semper congue dolor, ornare pretium orci. Aliquam tincidunt purus sed felis placerat volutpat. Donec aliquet dictum lacus. Etiam id augue in odio mollis sodales quis ac elit. Proin neque nisi, convallis in elit ac, eleifend rhoncus metus. Aliquam velit dui, egestas sed justo faucibus, pellentesque tristique purus. Vestibulum in commodo ante. Curabitur nec lectus nunc. Maecenas lobortis diam eget orci dictum vehicula. Ut rhoncus risus non orci dignissim, quis euismod enim placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque molestie mauris vitae nunc ullamcorper, eu efficitur augue elementum.",
  },
]

// Helper function to chunk array into groups of 3
const chunkArray = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  )
}

export default function Home() {
  return (
    <Box>
      <Title title="News" />
      <Flex flexDirection="column" gap={45} mt={20} pl={20}>
        {chunkArray(articleList, 3).map((row, rowIndex) => (
          <Flex flexDirection="column" key={rowIndex} gap={10}>
            {row.map((item, index) => (
              <Box key={index}>
                <Span>{item.label}</Span>
                <Span>{item.description}</Span>
              </Box>
            ))}
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}
