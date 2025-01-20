import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Powertrain {
  name: string;
  specs: string;
  power: string;
  torque: string;
  additional?: string;
}

interface PowertrainTableProps {
  powertrains: Powertrain[];
}

export function PowertrainTable({ powertrains }: PowertrainTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Variant</TableHead>
          <TableHead>Specifications</TableHead>
          <TableHead>Power</TableHead>
          <TableHead>Torque</TableHead>
          <TableHead>Additional</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {powertrains.map((powertrain) => (
          <TableRow key={powertrain.name}>
            <TableCell className="font-medium">{powertrain.name}</TableCell>
            <TableCell>{powertrain.specs}</TableCell>
            <TableCell>{powertrain.power}</TableCell>
            <TableCell>{powertrain.torque}</TableCell>
            <TableCell>{powertrain.additional || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
