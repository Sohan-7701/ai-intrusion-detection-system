import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";

import { predictTraffic } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/* -------------------- TYPES -------------------- */

interface TrafficEntry {
  id: string;
  flowId: string;
  protocol: "TCP" | "UDP" | "ICMP";
  packetRate: number;
  flowDuration: number;
  prediction: "Normal" | "Attack";
  confidence: number;
  timestamp: string;
}

/* -------------------- COMPONENT -------------------- */

export default function TrafficAnalysis() {
  const [trafficData, setTrafficData] = useState<TrafficEntry[]>([]);
  const [search, setSearch] = useState("");
  const [protocol, setProtocol] = useState("all");
  const [trafficType, setTrafficType] = useState("all");
  const [loading, setLoading] = useState(false);

  /* -------------------- BACKEND CALL -------------------- */

  const handleAnalyzeTraffic = async () => {
    setLoading(true);

    // 🔀 Random protocol selection
    const protocols = [
      { name: "TCP", value: 6, port: 443 },
      { name: "UDP", value: 17, port: 53 },
      { name: "ICMP", value: 1, port: 0 },
    ];
    const selected = protocols[Math.floor(Math.random() * protocols.length)];

    try {
      const response = await predictTraffic({
        "Dst Port": selected.port,
        "Protocol": selected.value,
        "Fwd Packet Length Min": Math.random() * 20,
        "Fwd Packet Length Std": Math.random() * 30,
        "Bwd Packet Length Min": Math.random() * 20,
        "Bwd Packet Length Mean": Math.random() * 80,
        "Bwd Packet Length Std": Math.random() * 40,
        "Bwd IAT Std": Math.random() * 400,
        "Bwd IAT Max": Math.random() * 1500,
        "Bwd Packets/s": Math.random() * 20,
        "Packet Length Min": Math.random() * 10,
        "FIN Flag Count": selected.value === 6 ? 1 : 0,
        "SYN Flag Count": selected.value === 6 ? 1 : 0,
        "Bwd Segment Size Avg": Math.random() * 100,
        "Subflow Fwd Packets": Math.floor(Math.random() * 10),
        "Fwd Seg Size Min": Math.random() * 40,
        "Idle Mean": Math.random() * 10,
        "Idle Std": Math.random() * 5,
        "Idle Max": Math.random() * 15,
        "Idle Min": Math.random() * 2,
      });

      const newEntry: TrafficEntry = {
        id: Date.now().toString(),
        flowId: `FLW-${Math.floor(Math.random() * 100000)}`,
        protocol: selected.name,
        packetRate: Math.floor(Math.random() * 12000),
        flowDuration: Math.random() * 120,
        prediction:
          response.prediction === "Intrusion Detected"
            ? "Attack"
            : "Normal",
        confidence: Math.round(
          Math.max(response.probability) * 100
        ),
        timestamp: new Date().toLocaleString(),
      };

      setTrafficData((prev) => [newEntry, ...prev]);
    } catch (error) {
      toast({
        title: "Backend Offline",
        description: "AI engine is not running",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- FILTERING -------------------- */

  const filteredData = trafficData.filter((entry) => {
    const matchesSearch = entry.flowId
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesProtocol =
      protocol === "all" || entry.protocol === protocol;
    const matchesType =
      trafficType === "all" || entry.prediction === trafficType;
    return matchesSearch && matchesProtocol && matchesType;
  });

  /* -------------------- CSV EXPORT -------------------- */

  const handleExportCSV = () => {
    const headers = [
      "Flow ID",
      "Protocol",
      "Packet Rate",
      "Flow Duration",
      "Prediction",
      "Confidence",
      "Timestamp",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map((e) =>
        [
          e.flowId,
          e.protocol,
          e.packetRate,
          e.flowDuration,
          e.prediction,
          e.confidence,
          e.timestamp,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "traffic-analysis.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "CSV Exported",
      description: `${filteredData.length} records exported`,
    });
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Traffic Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Live traffic analysis powered by AI backend
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAnalyzeTraffic} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze New Traffic"}
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Flow ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={protocol} onValueChange={setProtocol}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Protocol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="TCP">TCP</SelectItem>
            <SelectItem value="UDP">UDP</SelectItem>
            <SelectItem value="ICMP">ICMP</SelectItem>
          </SelectContent>
        </Select>

        <Select value={trafficType} onValueChange={setTrafficType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Traffic Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Attack">Attack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flow ID</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>Packet Rate</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Prediction</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono">{entry.flowId}</TableCell>
              <TableCell>
                <Badge variant="outline">{entry.protocol}</Badge>
              </TableCell>
              <TableCell>{entry.packetRate}</TableCell>
              <TableCell>{entry.flowDuration.toFixed(2)}s</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    entry.prediction === "Normal"
                      ? "bg-success/20 text-success"
                      : "bg-destructive/20 text-destructive"
                  )}
                >
                  {entry.prediction}
                </Badge>
              </TableCell>
              <TableCell>{entry.confidence}%</TableCell>
              <TableCell>{entry.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="text-sm text-muted-foreground">
        Showing {filteredData.length} entries
      </p>
    </div>
  );
}
